from __future__ import annotations

import asyncio
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from api.deps import get_qwen, get_repo, get_vane, get_wiki_reader, get_wiki_writer
from core.models import Decision, Need, ResearchJob, ResearchSession
from db.repository import SessionRepository
from services.gap_analyzer import analyze_gaps
from services.intent_classifier import classify_intent
from services.orchestrator import run_direct_lookup, run_research_pipeline
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


@router.post("")
async def create_session(
    req: CreateSessionRequest,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
):
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


@router.post("/{session_id}/research")
async def start_research(
    session_id: str,
    repo: SessionRepository = Depends(get_repo),
    qwen: QwenClient = Depends(get_qwen),
    vane: VaneClient = Depends(get_vane),
    wiki: WikiReader = Depends(get_wiki_reader),
):
    session = await repo.get_session(session_id)
    if session is None:
        raise HTTPException(404, "Session not found")

    if session.mode == "direct-lookup":
        session = await run_direct_lookup(session, vane)
        await repo.save_session(session)
        return {"session": session}

    job = ResearchJob(session_id=session.id)
    await repo.save_job(job)

    session.status = "researching"
    await repo.save_session(session)

    asyncio.create_task(
        run_research_pipeline(session, job, repo, qwen, vane, wiki)
    )

    return {"job_id": job.job_id, "status": job.status}


@router.get("/{session_id}/status")
async def get_status(session_id: str, repo: SessionRepository = Depends(get_repo)):
    job = await repo.get_job(session_id)
    if job is None:
        raise HTTPException(404, "No research job for this session")
    return job


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
