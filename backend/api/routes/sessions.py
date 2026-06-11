from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

import re

from api.deps import get_firecrawl, get_qwen, get_repo, get_vane, get_wiki_reader, get_wiki_writer
from services.firecrawl_client import FirecrawlClient


def _clean_list_line(line: str) -> str:
    """Clean a pasted list line: strip numbering, bullets, tabs, collapse whitespace."""
    s = line.strip()
    if not s:
        return ""
    s = re.sub(r"^\d+[\.\)\-:\s]+", "", s)
    s = re.sub(r"^[-•*]\s+", "", s)
    s = s.replace("\t", " — ", 1).replace("\t", ", ")
    s = re.sub(r"\s{2,}", " ", s)
    return s.strip()
from core.models import Decision, Need, ResearchJob, ResearchSession
from db.repository import SessionRepository
from services.gap_analyzer import analyze_gaps
from services.intent_classifier import classify_intent
from services.orchestrator import (
    run_direct_lookup,
    run_research_pipeline,
    spawn_pipeline_task,
)
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader
from services.wiki_writer import WikiWriter

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


class CreateSessionRequest(BaseModel):
    goal: str
    budget: float | None = None
    wiki_context: list[str] = []
    mode: str | None = None
    auto_research: bool = False
    needs_list: list[str] | None = None


@router.post("")
async def create_session(
    req: CreateSessionRequest,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
):
    if req.needs_list:
        mode = "goal-driven"
        needs = [
            Need(description=cleaned, rationale="User-provided", selected=True)
            for line in req.needs_list
            if (cleaned := _clean_list_line(line))
        ]
        session = ResearchSession(
            goal=req.goal,
            mode=mode,
            budget=req.budget,
            wiki_context=req.wiki_context,
            needs=needs,
            status="analyzing",
        )
        await repo.save_session(session)
        return session

    if req.mode:
        mode = req.mode
    else:
        intent = await classify_intent(qwen, req.goal)
        mode = intent.mode

    session = ResearchSession(
        goal=req.goal,
        mode=mode,
        budget=req.budget,
        wiki_context=req.wiki_context,
    )
    await repo.save_session(session)
    return session


@router.get("")
async def list_sessions(repo: SessionRepository = Depends(get_repo)):
    return await repo.list_sessions()


@router.get("/{session_id}")
async def get_session(session_id: str, repo: SessionRepository = Depends(get_repo)):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")
    return session


@router.post("/{session_id}/analyze")
async def analyze(
    session_id: str,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
    vane: VaneClient = Depends(get_vane),
    wiki: WikiReader = Depends(get_wiki_reader),
):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")

    equipment = wiki.read_equipment_inventory()
    context_text = "\n\n".join(
        wiki.read_project_page(slug) for slug in session.wiki_context
    )

    needs = await analyze_gaps(qwen, session.goal, equipment, context_text, session.budget, vane=vane)
    session.needs = needs
    session.status = "analyzing"
    await repo.save_session(session)
    return session


class StartResearchRequest(BaseModel):
    need_ids: list[str] | None = None


@router.post("/{session_id}/research")
async def start_research(
    session_id: str,
    req: StartResearchRequest | None = None,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
    vane: VaneClient = Depends(get_vane),
    wiki: WikiReader = Depends(get_wiki_reader),
    firecrawl: FirecrawlClient = Depends(get_firecrawl),
):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")

    if session.mode == "direct-lookup":
        session = await run_direct_lookup(session, vane)
        await repo.save_session(session)
        return {"session": session}

    # Idempotency: a double-submit must not spawn a second pipeline
    existing = await repo.get_job(session_id)
    if existing and existing.status in ("queued", "searching", "evaluating", "synthesizing"):
        return {"job_id": existing.job_id, "status": existing.status}

    # Honor the gap-analysis checkbox selection when the frontend sends one
    if req is not None and req.need_ids is not None and session.needs:
        chosen = set(req.need_ids)
        if not any(n.id in chosen for n in session.needs):
            raise HTTPException(400, "need_ids matched no needs — nothing to research")
        for need in session.needs:
            need.selected = need.id in chosen

    job = ResearchJob(session_id=session.id)
    await repo.save_job(job)

    session.status = "researching"
    await repo.save_session(session)

    spawn_pipeline_task(
        run_research_pipeline(session, job, repo, qwen, vane, wiki, firecrawl)
    )

    return {"job_id": job.job_id, "status": job.status}


@router.get("/{session_id}/status")
async def get_status(session_id: str, repo: SessionRepository = Depends(get_repo)):
    job = await repo.get_job(session_id)
    if job is None:
        raise HTTPException(404, "No research job for this session")

    need_results = await repo.get_need_results(session_id)
    need_statuses = [
        {
            "need_id": nr.need_id,
            "description": nr.need_description,
            "status": nr.status,
            "product_count": len(nr.products),
            "error": nr.error,
        }
        for nr in need_results
    ]

    return {
        "job_id": job.job_id,
        "session_id": job.session_id,
        "status": job.status,
        "needs_completed": job.needs_completed,
        "needs_total": job.needs_total,
        "error": job.error,
        "started_at": job.started_at.isoformat() if job.started_at else None,
        "need_statuses": need_statuses,
    }


@router.post("/{session_id}/cancel")
async def cancel_research(
    session_id: str,
    repo: SessionRepository = Depends(get_repo),
):
    job = await repo.get_job(session_id)
    if job is None:
        raise HTTPException(404, "No research job for this session")
    if job.status in ("complete", "failed", "cancelled"):
        return {"status": job.status, "message": "Job already finished"}

    job.status = "cancelled"
    job.error = "Cancelled by user"
    await repo.save_job(job)
    return {"status": "cancelled"}


@router.post("/{session_id}/retry")
async def retry_research(
    session_id: str,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
    vane: VaneClient = Depends(get_vane),
    wiki: WikiReader = Depends(get_wiki_reader),
    firecrawl: FirecrawlClient = Depends(get_firecrawl),
):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")

    if session.mode == "direct-lookup":
        session = await run_direct_lookup(session, vane)
        await repo.save_session(session)
        return {"session": session}

    # Supersede any unfinished previous job so startup recovery doesn't
    # re-spawn a second pipeline for this session
    old_job = await repo.get_job(session_id)
    if old_job and old_job.status not in ("complete", "failed", "cancelled"):
        old_job.status = "cancelled"
        old_job.error = "Superseded by retry"
        await repo.save_job(old_job)

    job = ResearchJob(session_id=session.id)
    await repo.save_job(job)

    session.status = "researching"
    await repo.save_session(session)

    spawn_pipeline_task(
        run_research_pipeline(session, job, repo, qwen, vane, wiki, firecrawl)
    )

    return {"job_id": job.job_id, "status": "queued"}


class DecideRequest(BaseModel):
    project_slug: str | None = None
    rationale: str = ""
    budget_category: str | None = None
    selected_product_ids: list[str] = []


@router.post("/{session_id}/decide")
async def decide(
    session_id: str,
    req: DecideRequest,
    repo: SessionRepository = Depends(get_repo),
    writer: WikiWriter = Depends(get_wiki_writer),
):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")

    all_products = [p for n in session.needs for p in n.products]
    selected = [p for p in all_products if p.id in req.selected_product_ids]
    for p in selected:
        p.selected_for_purchase = True

    decision = Decision(
        session_id=session.id,
        decision_date=date.today().isoformat(),
        project_slug=req.project_slug,
        needs_addressed=[n.description for n in session.needs if n.selected],
        selected_products=selected,
        total_cost=sum(p.price or 0 for p in selected),
        budget_category=req.budget_category,
        rationale=req.rationale,
        alternatives_considered=len(all_products),
    )

    path = writer.write_decision_page(session, decision, all_products)

    session.status = "decided"
    await repo.save_session(session)

    return {"decision": decision, "wiki_path": str(path)}
