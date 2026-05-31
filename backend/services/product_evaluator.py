from __future__ import annotations

from pydantic import BaseModel, Field

from core.models import ProductCard
from services.qwen import QwenClient
from services.vane_client import VaneSearchResult

SYSTEM = """You evaluate products found by web search against a specific need.
For each product found in the search results, extract: name, price (if found), source_url, source_name, fit_score (strong/partial/poor), fit_rationale (1-2 sentences), specs (key-value pairs), and risks.
Be honest. If a product is a poor fit, say so. If the price isn't found, set it to null."""


class EvaluationResult(BaseModel):
    products: list[ProductCard] = Field(default_factory=list)


async def evaluate_products(
    qwen: QwenClient,
    need_description: str,
    vane_result: VaneSearchResult,
) -> list[ProductCard]:
    sources_text = "\n\n".join(
        f"Source: {s.title} ({s.url})\n{s.content}" for s in vane_result.sources
    )
    user_prompt = f"""Need: {need_description}

Search results summary:
{vane_result.message}

Individual sources:
{sources_text}

Evaluate each product found for fit against the need."""

    result = await qwen.generate(
        system=SYSTEM,
        user=user_prompt,
        response_model=EvaluationResult,
    )
    return result.products
