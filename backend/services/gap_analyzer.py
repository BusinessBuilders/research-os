from __future__ import annotations

from pydantic import BaseModel, Field

from core.models import Need
from services.qwen import QwenClient

SYSTEM = """You are an equipment gap analyst. Given current equipment and a goal, identify what is missing to achieve the goal.
Be specific about parts, tools, and components. Consider the user's budget if provided.
Return a JSON array of needs, each with: description, rationale, priority (critical/important/nice-to-have), estimated_cost_range."""


class GapAnalysisResult(BaseModel):
    needs: list[Need] = Field(default_factory=list)


async def analyze_gaps(
    qwen: QwenClient,
    goal: str,
    equipment: str,
    wiki_context: str,
    budget: float | None,
) -> list[Need]:
    user_prompt = f"""Goal: {goal}

Current equipment:
{equipment}

Project context:
{wiki_context}

Budget: {"$" + str(budget) if budget else "Not specified"}

Identify what equipment, parts, or tools are missing to achieve this goal."""

    result = await qwen.generate(
        system=SYSTEM,
        user=user_prompt,
        response_model=GapAnalysisResult,
    )
    return result.needs
