from __future__ import annotations

from core.models import ProductCard, SynthesisResult
from services.qwen import QwenClient

SYSTEM = """You synthesize product selections into a coherent recommendation.
Prioritize by impact on the goal and budget constraints.
Suggest what to buy now vs. defer.
Return: recommendation (2-3 sentences), shopping_list (array of {product, price, priority}), total_cost, deferred_items (array of {need, reason_to_defer})."""


async def synthesize(
    qwen: QwenClient,
    goal: str,
    selected_products: list[ProductCard],
    budget: float | None,
) -> SynthesisResult:
    products_text = "\n".join(
        f"- {p.name}: ${p.price or 'N/A'} ({p.fit_score} fit) — {p.fit_rationale}"
        for p in selected_products
    )
    user_prompt = f"""Goal: {goal}
Budget: {"$" + str(budget) if budget else "Not specified"}

Selected products:
{products_text}

Synthesize a recommendation."""

    return await qwen.generate(
        system=SYSTEM,
        user=user_prompt,
        response_model=SynthesisResult,
    )
