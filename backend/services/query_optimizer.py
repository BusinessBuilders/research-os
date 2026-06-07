from __future__ import annotations

from pydantic import BaseModel, Field

from services.qwen import QwenClient

SYSTEM = """You are a search query optimizer for a product research tool.

Given a product need description (which may be messy — pasted from a list, tab-separated, with notes), produce:

1. product_name: The short, clean product name (e.g. "ER11 collet set", "milling vise", "dial indicator")
2. search_queries: 2-3 optimized Google/Amazon search queries that will find this product for purchase. Each should be different:
   - One specific (include specs/model numbers if mentioned)
   - One broader (category-level, catches alternatives)
   - One community-focused (for Reddit/forum recommendations)
3. evaluation_context: Key requirements from the description that should be used to evaluate products (size, specs, brand preferences, use case)

Keep search queries SHORT (3-8 words). Search engines work best with concise queries, not sentences."""


class OptimizedQueries(BaseModel):
    product_name: str
    search_queries: list[str] = Field(min_length=2, max_length=4)
    evaluation_context: str


async def optimize_queries(
    qwen: QwenClient,
    need_description: str,
) -> OptimizedQueries:
    return await qwen.generate(
        system=SYSTEM,
        user=f"Product need:\n{need_description}",
        response_model=OptimizedQueries,
    )
