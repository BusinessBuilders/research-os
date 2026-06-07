from __future__ import annotations

from pydantic import BaseModel, Field

from core.models import ProductCard
from services.qwen import QwenClient
from services.vane_client import VaneSearchResult

SYSTEM = """You are a product research analyst. You extract real, purchasable products from search results.

RULES:
1. Only extract products that have a real purchase link (Amazon, eBay, vendor site). Skip blog mentions without links.
2. source_url MUST be a direct product page URL, not a search results page or category page.
3. price should be the actual listed price. Set to null if not found — do NOT guess.
4. source_name should be the retailer (Amazon, eBay, AliExpress, etc.) not the brand.
5. fit_score: "strong" = exact match for the need, "partial" = usable but compromises, "poor" = wrong category or major issues.
6. fit_rationale: 1-2 sentences explaining WHY. Reference community feedback if available.
7. risks: real concerns like "no datasheet", "lead time 2-3 wk", "QC variance reported on Reddit".
8. specs: extract key technical specifications as key-value pairs.

Return a JSON object with a "products" array."""


SYSTEM_WITH_COMMUNITY = """You are a product research analyst combining community intelligence with product data.

You have TWO inputs:
1. Community recommendations from Reddit/forums — what real users actually recommend and warn about.
2. Product listings from retailers — actual purchasable items with prices.

RULES:
1. Only extract products that have a real purchase link. Skip blog mentions without links.
2. source_url MUST be a direct product page URL.
3. Incorporate community sentiment into fit_score and fit_rationale:
   - If Reddit users specifically recommend a product → boost fit_score and mention it.
   - If Reddit users warn against a product → lower fit_score and note the warning.
4. risks should include community-reported issues ("Reddit users report gear stripping under load").
5. price should be actual listed price. Set to null if not found.
6. source_name = the retailer, not the brand.
7. fit_score: "strong"/"partial"/"poor" based on BOTH specs AND community reputation.
8. specs: extract key technical specifications as key-value pairs.

Return a JSON object with a "products" array."""


class EvaluationResult(BaseModel):
    products: list[ProductCard] = Field(default_factory=list)


async def evaluate_products(
    qwen: QwenClient,
    need_description: str,
    vane_result: VaneSearchResult,
    community_context: str = "",
) -> list[ProductCard]:
    sources_text = "\n\n".join(
        f"Source: {s.title} ({s.url})\n{s.content[:500]}"
        for s in vane_result.sources[:12]
    )

    parts = [f"Need: {need_description}"]
    if community_context:
        parts.append(f"Community recommendations (Reddit/forums):\n{community_context[:2000]}")
    parts.append(f"Search results summary:\n{vane_result.message[:3000]}")
    parts.append(f"Individual sources:\n{sources_text}")
    parts.append("Extract every purchasable product found. Include community sentiment in your evaluation.")

    result = await qwen.generate(
        system=SYSTEM_WITH_COMMUNITY if community_context else SYSTEM,
        user="\n\n".join(parts),
        response_model=EvaluationResult,
    )
    return result.products


async def evaluate_products_from_pages(
    qwen: QwenClient,
    need_description: str,
    vane_result: VaneSearchResult,
    scraped_pages: list[tuple[str, str]],
    community_context: str = "",
) -> list[ProductCard]:
    pages_text = "\n\n---\n\n".join(
        f"Product page: {url}\n{content[:800]}"
        for url, content in scraped_pages[:6]
    )

    sources_text = "\n\n".join(
        f"Source: {s.title} ({s.url})\n{s.content[:300]}"
        for s in vane_result.sources[:8]
    )

    parts = [f"Need: {need_description}"]
    if community_context:
        parts.append(f"Community recommendations (Reddit/forums):\n{community_context[:2000]}")
    parts.append(f"Scraped product pages (high-quality data):\n{pages_text}")
    parts.append(f"Additional search sources:\n{sources_text}")
    parts.append("Extract every purchasable product. Prefer data from scraped product pages for prices and specs. Include community sentiment.")

    result = await qwen.generate(
        system=SYSTEM_WITH_COMMUNITY if community_context else SYSTEM,
        user="\n\n".join(parts),
        response_model=EvaluationResult,
    )
    return result.products
