from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from urllib.parse import urlparse

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

SCRAPE_DOMAINS = ("amazon.com", "ebay.com", "walmart.com", "newegg.com")
SCRAPE_CONCURRENCY = 5
SCRAPE_TIMEOUT_SECONDS = 20.0
NEED_TIMEOUT_SECONDS = 1200.0  # hard ceiling per need; a hung search/eval must not stall the batch forever

# Strong references to fire-and-forget pipeline tasks: without these,
# asyncio tasks can be garbage-collected (silently cancelled) mid-run
_background_tasks: set[asyncio.Task] = set()


def spawn_pipeline_task(coro) -> asyncio.Task:
    task = asyncio.create_task(coro)
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)
    return task


def _is_scrapeable_product_url(url: str) -> bool:
    # Exact host match (or subdomain), not substring — "evil.com/amazon.com"
    # must not pass and get fetched server-side by Firecrawl
    try:
        parsed = urlparse(url)
    except ValueError:
        return False
    if parsed.scheme not in ("http", "https"):
        return False
    host = (parsed.hostname or "").lower()
    return any(host == d or host.endswith("." + d) for d in SCRAPE_DOMAINS)


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
    semaphore = asyncio.Semaphore(SCRAPE_CONCURRENCY)
    target_urls = urls[:15]

    async def scrape_one(url: str) -> tuple[str, str] | None:
        async with semaphore:
            try:
                markdown = await asyncio.wait_for(
                    firecrawl.scrape(url), timeout=SCRAPE_TIMEOUT_SECONDS
                )
            except Exception as e:
                logger.debug(f"Firecrawl scrape failed for {url}: {e}")
                return None
        if markdown and len(markdown) > 100:
            return (url, markdown)
        return None

    scraped = await asyncio.gather(*(scrape_one(u) for u in target_urls))
    results = [r for r in scraped if r is not None]
    if target_urls and not results:
        logger.warning(
            f"All {len(target_urls)} Firecrawl scrapes failed or returned nothing — "
            "evaluation will fall back to search summaries only"
        )
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

    try:
        await repo.save_need_result(nr)

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

        # No data = no evaluation: an LLM given empty inputs fabricates
        # plausible-looking products with dead URLs
        if not unique_sources and not community_text.strip():
            raise RuntimeError(
                "All searches returned no sources — check Vane/SearXNG"
            )

        nr.status = "evaluating"
        await repo.save_need_result(nr)

        # Phase 2: Firecrawl scraping
        scraped_pages: list[tuple[str, str]] = []
        if firecrawl:
            product_urls = [
                s.url for s in unique_sources
                if s.url and _is_scrapeable_product_url(s.url)
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


async def _research_need_with_timeout(
    session_id: str,
    need: Need,
    qwen: QwenClient,
    vane: VaneClient,
    repo: SessionRepository,
    firecrawl: FirecrawlClient | None = None,
) -> NeedResult:
    try:
        return await asyncio.wait_for(
            _research_single_need(session_id, need, qwen, vane, repo, firecrawl),
            timeout=NEED_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        logger.error(f"Need timed out after {NEED_TIMEOUT_SECONDS:.0f}s: {need.description[:60]}")
        nr = NeedResult(
            session_id=session_id,
            need_id=need.id,
            need_description=need.description,
            status="failed",
            error=f"Timed out after {NEED_TIMEOUT_SECONDS:.0f}s",
        )
        await repo.save_need_result(nr)
        return nr


async def _finalize_cancelled(
    session: ResearchSession,
    repo: SessionRepository,
) -> ResearchSession:
    """Land a cancelled session in a terminal state with its partial results.

    Leaving status='researching' strands the UI in a permanent spinner."""
    all_results = await repo.get_need_results(session.id)
    result_map = {nr.need_id: nr for nr in all_results}
    for need in session.needs:
        nr = result_map.get(need.id)
        if nr and nr.products:
            need.products = nr.products
    has_partial = any(nr.status == "complete" for nr in all_results)
    session.status = "complete" if has_partial else "failed"
    await repo.save_session(session)
    return session


async def run_research_pipeline(
    session: ResearchSession,
    job: ResearchJob,
    repo: SessionRepository,
    qwen: QwenClient,
    vane: VaneClient,
    wiki: WikiReader,
    firecrawl: FirecrawlClient | None = None,
) -> ResearchSession:
    # Any escape from the body must mark the job failed — a job left in
    # "searching" is re-spawned by recover_incomplete_jobs on every restart
    try:
        return await _run_research_pipeline_inner(
            session, job, repo, qwen, vane, wiki, firecrawl
        )
    except Exception as e:
        logger.exception(f"Research pipeline crashed for session {session.id}: {e}")
        job.status = "failed"
        job.error = f"Pipeline error: {str(e)[:400]}"
        try:
            await repo.save_job(job)
            session.status = "failed"
            await repo.save_session(session)
        except Exception:
            logger.exception("Could not persist failed state")
        return session


async def _run_research_pipeline_inner(
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

    BATCH_SIZE = 3
    for i in range(0, len(remaining), BATCH_SIZE):
        # Check OUR job row by job_id — get_job(session_id) returns the latest
        # job, which after a retry is a different (superseding) job
        fresh_job = await repo.get_job_by_id(job.job_id)
        if fresh_job and fresh_job.status == "cancelled":
            return await _finalize_cancelled(session, repo)

        batch = remaining[i:i + BATCH_SIZE]
        logger.info(f"Research batch {i // BATCH_SIZE + 1}/{(len(remaining) + BATCH_SIZE - 1) // BATCH_SIZE}: {[n.description[:30] for n in batch]}")
        batch_tasks = [
            _research_need_with_timeout(session.id, need, qwen, vane, repo, firecrawl)
            for need in batch
        ]
        await asyncio.gather(*batch_tasks, return_exceptions=True)

        # Re-check before the progress save: writing our stale in-memory
        # status would clobber a cancel issued while the batch was running
        fresh_job = await repo.get_job_by_id(job.job_id)
        if fresh_job and fresh_job.status == "cancelled":
            return await _finalize_cancelled(session, repo)

        job.needs_completed = len([
            nr for nr in await repo.get_need_results(session.id)
            if nr.status == "complete"
        ])
        await repo.save_job(job)

    fresh_job = await repo.get_job_by_id(job.job_id)
    if fresh_job and fresh_job.status == "cancelled":
        return await _finalize_cancelled(session, repo)

    all_results = await repo.get_need_results(session.id)

    # A crashed timeout-handler can leave a row in a non-terminal state while
    # the job completes — never leave a need showing a spinner forever
    for nr in all_results:
        if nr.status not in ("complete", "failed"):
            nr.status = "failed"
            nr.error = nr.error or "Did not finish"
            await repo.save_need_result(nr)

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
        session.status = "failed"
    else:
        job.status = "complete"
        session.status = "complete"

    job.current_need = None
    await repo.save_job(job)
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
        spawn_pipeline_task(
            run_research_pipeline(session, job, repo, qwen, vane, wiki)
        )
        recovered += 1
    return recovered
