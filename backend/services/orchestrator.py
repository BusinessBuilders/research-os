from __future__ import annotations

import asyncio
from datetime import datetime, timezone

from core.models import (
    Citation, DirectLookupResult, Need, ResearchJob, ResearchSession,
)
from db.repository import SessionRepository
from services.product_evaluator import evaluate_products
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader

MAX_SEARCH_ROUNDS = 1
MIN_PRODUCTS_PER_NEED = 1


async def _research_single_need(
    need: Need,
    qwen: QwenClient,
    vane: VaneClient,
) -> list:
    try:
        query = f"{need.description} {need.estimated_cost_range} buy compare review"
        vane_result = await vane.search(
            query=query,
            optimization_mode="speed",
            system_instructions="Find specific products with prices, specs, and purchase links. Include alternatives.",
        )
        return await evaluate_products(qwen, need.description, vane_result)
    except Exception:
        return []


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
        from core.models import Need
        session.needs = [Need(
            description=session.goal,
            rationale="Auto-generated from research goal",
            priority="critical",
        )]
        await repo.save_session(session)

    selected_needs = [n for n in session.needs if n.selected]
    job.needs_total = len(selected_needs)
    await repo.save_job(job)

    tasks = [
        _research_single_need(need, qwen, vane)
        for need in selected_needs
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    for need, result in zip(selected_needs, results):
        if isinstance(result, list):
            need.products = result
        job.needs_completed += 1
        job.current_need = need.description
        await repo.save_job(job)

    session.status = "complete"
    await repo.save_session(session)

    job.status = "complete"
    job.current_need = None
    await repo.save_job(job)

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
