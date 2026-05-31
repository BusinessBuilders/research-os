from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone

from core.models import (
    Citation, DirectLookupResult, Need, NeedResult,
    ResearchJob, ResearchSession,
)
from db.repository import SessionRepository
from services.product_evaluator import evaluate_products
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader

logger = logging.getLogger(__name__)


async def _research_single_need(
    session_id: str,
    need: Need,
    qwen: QwenClient,
    vane: VaneClient,
    repo: SessionRepository,
) -> NeedResult:
    nr = NeedResult(
        session_id=session_id,
        need_id=need.id,
        need_description=need.description,
        status="searching",
    )
    await repo.save_need_result(nr)

    try:
        query = f"{need.description} {need.estimated_cost_range} buy compare review"
        vane_result = await vane.search(
            query=query,
            optimization_mode="speed",
            system_instructions="Find specific products with prices, specs, and purchase links. Include alternatives.",
        )

        nr.status = "evaluating"
        await repo.save_need_result(nr)

        products = await evaluate_products(qwen, need.description, vane_result)
        nr.products = products
        nr.status = "complete"
        nr.searched_at = datetime.now(timezone.utc)

    except Exception as e:
        logger.error(f"Research failed for need {need.description}: {e}")
        nr.status = "failed"
        nr.error = str(e)[:500]

    await repo.save_need_result(nr)
    return nr


async def run_research_pipeline(
    session: ResearchSession,
    job: ResearchJob,
    repo: SessionRepository,
    qwen: QwenClient,
    vane: VaneClient,
    wiki: WikiReader,
) -> ResearchSession:
    job.status = "searching"
    job.started_at = datetime.now(timezone.utc)

    if not session.needs:
        session.needs = [Need(
            description=session.goal,
            rationale="Auto-generated from research goal",
            priority="critical",
        )]
        await repo.save_session(session)

    selected_needs = [n for n in session.needs if n.selected]
    job.needs_total = len(selected_needs)
    await repo.save_job(job)

    existing = await repo.get_need_results(session.id)
    done_ids = {nr.need_id for nr in existing if nr.status == "complete"}
    remaining = [n for n in selected_needs if n.id not in done_ids]
    job.needs_completed = len(done_ids)
    await repo.save_job(job)

    tasks = [
        _research_single_need(session.id, need, qwen, vane, repo)
        for need in remaining
    ]
    await asyncio.gather(*tasks, return_exceptions=True)

    fresh_job = await repo.get_job(session.id)
    if fresh_job and fresh_job.status == "cancelled":
        return session

    all_results = await repo.get_need_results(session.id)
    result_map = {nr.need_id: nr for nr in all_results}
    for need in selected_needs:
        nr = result_map.get(need.id)
        if nr and nr.products:
            need.products = nr.products

    job.needs_completed = len([nr for nr in all_results if nr.status == "complete"])

    has_failures = any(nr.status == "failed" for nr in all_results)
    if has_failures and job.needs_completed == 0:
        job.status = "failed"
        job.error = "All searches failed"
    else:
        job.status = "complete"

    job.current_need = None
    await repo.save_job(job)

    session.status = "complete"
    await repo.save_session(session)

    return session


async def run_direct_lookup(
    session: ResearchSession,
    vane: VaneClient,
) -> ResearchSession:
    vane_result = await vane.search(
        query=session.goal,
        optimization_mode="balanced",
        system_instructions="Find the exact answer. Include part numbers, prices, and fitment details if relevant.",
    )

    citations = [
        Citation(title=s.title, url=s.url, snippet=s.content[:200])
        for s in vane_result.sources
    ]

    session.lookup_result = DirectLookupResult(
        answer=vane_result.message,
        confidence=0.8,
        citations=citations,
    )
    session.status = "complete"
    return session


async def recover_incomplete_jobs(
    repo: SessionRepository,
    qwen: QwenClient,
    vane: VaneClient,
    wiki: WikiReader,
) -> int:
    incomplete = await repo.find_incomplete_jobs()
    recovered = 0
    for job in incomplete:
        session = await repo.get_session(job.session_id)
        if session is None:
            job.status = "failed"
            job.error = "Session not found"
            await repo.save_job(job)
            continue

        logger.info(f"Recovering job {job.job_id} for session {session.id}")
        asyncio.create_task(
            run_research_pipeline(session, job, repo, qwen, vane, wiki)
        )
        recovered += 1
    return recovered
