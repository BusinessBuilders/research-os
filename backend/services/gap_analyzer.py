from __future__ import annotations

from pydantic import BaseModel, Field

from core.models import Need
from services.qwen import QwenClient
from services.vane_client import VaneClient

SYSTEM = """You are an equipment gap analyst. You have been given real web search results about the user's goal.
Use the search results to identify what equipment, tools, and components they actually need.
Prioritize items that are frequently recommended, well-reviewed, or trending in the community.
Be specific about parts, tools, and components. Consider the user's budget if provided.
Return a JSON object with a "needs" array, each with: description, rationale, priority (critical/important/nice-to-have), estimated_cost_range."""


class GapAnalysisResult(BaseModel):
    needs: list[Need] = Field(default_factory=list)


async def analyze_gaps(
    qwen: QwenClient,
    goal: str,
    equipment: str,
    wiki_context: str,
    budget: float | None,
    vane: VaneClient | None = None,
) -> list[Need]:
    web_context = ""
    if vane:
        try:
            result = await vane.search(
                query=f"{goal} recommended setup guide what to buy reddit",
                optimization_mode="quality",
                system_instructions="Find buying guides, community recommendations, and trending setups. Include Reddit, YouTube, and forum posts.",
            )
            web_context = f"Web research results:\n{result.message}\n\nSources:\n"
            for s in result.sources[:10]:
                web_context += f"- {s.title} ({s.url}): {s.content[:200]}\n"
        except Exception as e:
            import logging
            logging.error(f"Vane search failed during gap analysis: {e}")

    user_prompt = f"""Goal: {goal}

{web_context}

Current equipment:
{equipment or "Not specified"}

Project context:
{wiki_context or "None"}

Budget: {"$" + str(budget) if budget else "Not specified"}

Based on the web research and community recommendations above, identify what equipment, parts, or tools are needed to achieve this goal. Prioritize items that real users recommend."""

    result = await qwen.generate(
        system=SYSTEM,
        user=user_prompt,
        response_model=GapAnalysisResult,
    )
    return result.needs
