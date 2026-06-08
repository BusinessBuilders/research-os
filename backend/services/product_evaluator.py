from __future__ import annotations

from pydantic import BaseModel, Field

from core.models import ProductCard
from services.qwen import QwenClient
from services.vane_client import VaneSearchResult

SYSTEM = """You are a product research analyst. You extract EVERY real, purchasable product from search results.

RULES:
1. Extract ALL products with a purchase link. Do NOT filter, limit, or skip products. List everything.
2. source_url MUST be a direct product page URL, not a search results page or category page.
3. price should be the actual listed price. Set to null if not found — do NOT guess.
4. source_name should be the retailer (Amazon, eBay, AliExpress, etc.) not the brand.
5. fit_score: "strong" = exact match for the need, "partial" = usable but compromises, "poor" = wrong category or major issues.
6. fit_rationale: 1-2 sentences explaining WHY. Reference community feedback if available.
7. risks: real concerns like "no datasheet", "lead time 2-3 wk", "QC variance reported on Reddit".
8. specs: extract key technical specifications as key-value pairs.
9. If the same product appears on multiple retailers, list it ONCE with the best-priced source.
10. Even products with incomplete data (missing price, partial specs) should be included — the user decides what matters.

Return a JSON object with a "products" array. There is NO limit on array size."""


SYSTEM_WITH_COMMUNITY = """You are a product research analyst combining community intelligence with product data.

You have TWO inputs:
1. Community recommendations from Reddit/forums — what real users actually recommend and warn about.
2. Product listings from retailers — actual purchasable items with prices.

RULES:
1. Extract ALL products with a purchase link. Do NOT filter, limit, or skip. List everything you find.
2. source_url MUST be a direct product page URL.
3. fit_rationale: 1-2 sentences explaining why this product fits the need based on specs and features.
4. community_note: What Reddit/forums say about this specific product or brand. Examples:
   - "Highly recommended on r/machinists — multiple users call this the gold standard for hobby mills"
   - "Reddit users warn: collet runout is inconsistent, check with dial indicator on arrival"
   - "Popular budget pick on r/hobbycnc, 4.5 star average across 200+ reviews"
   Set to null ONLY if the community sources have zero mentions of this product or brand.
5. risks should include community-reported issues ("Reddit users report gear stripping under load").
6. price should be actual listed price. Set to null if not found.
7. source_name = the retailer, not the brand.
8. fit_score: "strong"/"partial"/"poor" based on BOTH specs AND community reputation.
9. specs: extract key technical specifications as key-value pairs.
10. If the same product appears on multiple retailers, list it ONCE with the best-priced source.
11. Even products with incomplete data should be included — the user decides what matters.

Return a JSON object with a "products" array. There is NO limit on array size."""


class EvaluationResult(BaseModel):
    products: list[ProductCard] = Field(default_factory=list)


async def evaluate_products(
    qwen: QwenClient,
    need_description: str,
    vane_result: VaneSearchResult,
    community_context: str = "",
) -> list[ProductCard]:
    sources_text = "\n\n".join(
        f"Source: {s.title} ({s.url})\n{s.content[:600]}"
        for s in vane_result.sources[:30]
    )

    parts = [f"Need: {need_description}"]
    if community_context:
        parts.append(f"Community recommendations (Reddit/forums):\n{community_context[:3000]}")
    parts.append(f"Search results summary:\n{vane_result.message[:4000]}")
    parts.append(f"Individual sources:\n{sources_text}")
    parts.append("Extract EVERY purchasable product. No limit. List them all.")

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
        f"Product page: {url}\n{content[:1500]}"
        for url, content in scraped_pages[:10]
    )

    sources_text = "\n\n".join(
        f"Source: {s.title} ({s.url})\n{s.content[:400]}"
        for s in vane_result.sources[:20]
    )

    parts = [f"Need: {need_description}"]
    if community_context:
        parts.append(f"Community recommendations (Reddit/forums):\n{community_context[:3000]}")
    parts.append(f"Scraped product pages (high-quality data):\n{pages_text}")
    parts.append(f"Additional search sources:\n{sources_text}")
    parts.append("Extract EVERY purchasable product from ALL sources. No limit. Use scraped pages for accurate prices and specs. List them all.")

    result = await qwen.generate(
        system=SYSTEM_WITH_COMMUNITY if community_context else SYSTEM,
        user="\n\n".join(parts),
        response_model=EvaluationResult,
    )
    return result.products
