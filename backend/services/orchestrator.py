from __future__ import annotations

from datetime import datetime, timezone

from core.models import (
    Citation, DirectLookupResult, Need, ResearchJob, ResearchSession,
)
from db.repository import SessionRepository
from services.product_evaluator import evaluate_products
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader

MAX_SEARCH_ROUNDS = 3
MIN_PRODUCTS_PER_NEED = 2


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
    job.needs_total = len([n for n in session.needs if n.selected])
    await repo.save_job(job)

    if not session.needs:
        from core.models import Need
        session.needs = [Need(
            description=session.goal,
            rationale="Auto-generated from research goal",
            priority="critical",
        )]
        await repo.save_session(session)

    selected_needs = [n for n in session.needs if n.selected]

    for i, need in enumerate(selected_needs):
        if job.status == "cancelled":
            break

        job.current_need = need.description
        job.current_round = 0
        job.status = "searching"
        await repo.save_job(job)

        products = []
        for round_num in range(MAX_SEARCH_ROUNDS):
            job.current_round = round_num + 1
            await repo.save_job(job)

            query = f"{need.description} {need.estimated_cost_range} buy compare review"
            vane_result = await vane.search(
                query=query,
                optimization_mode="quality",
                system_instructions="Find specific products with prices, specs, and purchase links. Include alternatives.",
            )

            job.status = "evaluating"
            await repo.save_job(job)

            new_products = await evaluate_products(qwen, need.description, vane_result)
            products.extend(new_products)

            if len(products) >= MIN_PRODUCTS_PER_NEED:
                break

        need.products = products
        job.needs_completed = i + 1
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
