from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone

from core.models import (
    Citation, DirectLookupResult, Need, NeedResult,
    ProductCard, ResearchJob, ResearchSession,
)
from db.repository import SessionRepository
from services.firecrawl_client import FirecrawlClient
from services.product_evaluator import evaluate_products, evaluate_products_from_pages
from services.query_optimizer import OptimizedQueries, optimize_queries
from services.qwen import QwenClient
from services.vane_client import VaneClient, VaneSearchResult
from services.wiki_reader import WikiReader

logger = logging.getLogger(__name__)

RETAILERS = [
    ("amazon.com", "Amazon"),
    ("ebay.com", "eBay"),
]


async def _optimize_need_queries(
    qwen: QwenClient,
    need: Need,
) -> OptimizedQueries:
    try:
        return await optimize_queries(qwen, need.description)
    except Exception as e:
        logger.warning(f"Query optimization failed for '{need.description[:40]}': {e}")
        short = need.description.split("\t")[0].split(" — ")[0].strip()[:60]
        return OptimizedQueries(
            product_name=short,
            search_queries=[short, f"{short} buy", f"best {short} reddit"],
            evaluation_context=need.description,
        )


async def _search_retailer(
    vane: VaneClient,
    query: str,
    site: str,
    label: str,
) -> VaneSearchResult:
    return await vane.search(
        query=f"{query} site:{site}",
        optimization_mode="speed",
        system_instructions=f"Find specific products on {label} with prices, specs, and purchase links.",
    )


async def _search_community(
    vane: VaneClient,
    query: str,
) -> VaneSearchResult:
    return await vane.search(
        query=query,
        optimization_mode="quality",
        system_instructions="Find community recommendations, Reddit posts, forum discussions, and buying guides. Focus on what real users recommend and why.",
    )


async def _search_general(
    vane: VaneClient,
    query: str,
) -> VaneSearchResult:
    return await vane.search(
        query=query,
        optimization_mode="speed",
        system_instructions="Find specific products with prices, specs, and purchase links. Include specialty vendors and alternatives.",
    )


async def _scrape_product_urls(
    firecrawl: FirecrawlClient,
    urls: list[str],
) -> list[tuple[str, str]]:
    results = []
    for url in urls[:15]:
        try:
            markdown = await firecrawl.scrape(url)
            if markdown and len(markdown) > 100:
                results.append((url, markdown))
        except Exception as e:
            logger.debug(f"Firecrawl scrape failed for {url}: {e}")
    return results


async def _research_single_need(
    session_id: str,
    need: Need,
    qwen: QwenClient,
    vane: VaneClient,
    repo: SessionRepository,
    firecrawl: FirecrawlClient | None = None,
) -> NeedResult:
    nr = NeedResult(
        session_id=session_id,
        need_id=need.id,
        need_description=need.description,
        status="searching",
    )
    await repo.save_need_result(nr)

    try:
        # Phase 0: Optimize search queries with Qwen
        optimized = await _optimize_need_queries(qwen, need)
        logger.info(
            f"Optimized '{need.description[:40]}' → "
            f"product='{optimized.product_name}', "
            f"queries={optimized.search_queries}"
        )

        # Phase 1: Parallel searches using optimized queries
        search_tasks = []

        # Community search with the community-focused query
        community_query = next(
            (q for q in optimized.search_queries if "reddit" in q.lower() or "best" in q.lower()),
            optimized.search_queries[-1],
        )
        search_tasks.append(_search_community(vane, community_query))

        # Retailer searches with the specific query
        specific_query = optimized.search_queries[0]
        for site, label in RETAILERS:
            search_tasks.append(_search_retailer(vane, specific_query, site, label))

        # General search with the broader query
        broad_query = optimized.search_queries[1] if len(optimized.search_queries) > 1 else specific_query
        search_tasks.append(_search_general(vane, broad_query))

        search_results = await asyncio.gather(*search_tasks, return_exceptions=True)

        community_result = search_results[0] if not isinstance(search_results[0], Exception) else None
        retailer_results = [r for r in search_results[1:-1] if not isinstance(r, Exception)]
        general_result = search_results[-1] if not isinstance(search_results[-1], Exception) else None

        all_sources = []
        community_text = ""
        if community_result:
            community_text = community_result.message
            all_sources.extend(community_result.sources)
        for rr in retailer_results:
            all_sources.extend(rr.sources)
        if general_result:
            all_sources.extend(general_result.sources)

        # Deduplicate sources by URL
        seen_urls: set[str] = set()
        unique_sources = []
        for src in all_sources:
            if src.url and src.url not in seen_urls:
                seen_urls.add(src.url)
                unique_sources.append(src)

        nr.status = "evaluating"
        await repo.save_need_result(nr)

        # Phase 2: Firecrawl scraping
        scraped_pages: list[tuple[str, str]] = []
        if firecrawl:
            product_urls = [
                s.url for s in unique_sources
                if s.url and any(domain in s.url for domain in ["amazon.com", "ebay.com", "walmart.com", "newegg.com"])
            ]
            if product_urls:
                try:
                    scraped_pages = await _scrape_product_urls(firecrawl, product_urls)
                except Exception as e:
                    logger.warning(f"Firecrawl batch scrape failed, falling back: {e}")

        # Phase 3: Evaluate products — pass evaluation_context so Qwen knows what matters
        eval_description = f"{optimized.product_name}: {optimized.evaluation_context}"

        combined_vane = VaneSearchResult(
            message="\n\n".join(filter(None, [
                r.message for r in [community_result, general_result, *retailer_results]
                if r and not isinstance(r, Exception)
            ])),
            sources=unique_sources,
        )

        if scraped_pages:
            products = await evaluate_products_from_pages(
                qwen, eval_description, combined_vane, scraped_pages, community_text,
            )
        else:
            products = await evaluate_products(
                qwen, eval_description, combined_vane, community_text,
            )

        nr.products = products
        nr.status = "complete"
        nr.searched_at = datetime.now(timezone.utc)

        logger.info(
            f"Need '{optimized.product_name}' complete: "
            f"{len(unique_sources)} sources, {len(scraped_pages)} scraped, "
            f"{len(products)} products"
        )

    except Exception as e:
        logger.error(f"Research failed for need {need.description[:60]}: {e}")
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
    firecrawl: FirecrawlClient | None = None,
) -> ResearchSession:
    job.status = "searching"
    job.started_at = datetime.now(timezone.utc)

    if not session.needs:
        session.needs = [Need(
            description=session.goal,
            rationale="Auto-generated from research goal",
            estimated_cost_range="",
            selected=True,
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
        _research_single_need(session.id, need, qwen, vane, repo, firecrawl)
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
