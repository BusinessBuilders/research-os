from core.models import IntentResult
from services.qwen import QwenClient

SYSTEM = """You classify user queries into research modes.
- "goal-driven": user states a goal and wants gap analysis (e.g., "upgrade my robotics fab setup")
- "product-research": user wants to research/compare specific products (e.g., "best MIG welder under $500")
- "direct-lookup": user wants a specific fact, part number, or answer (e.g., "brake caliper part number for 09 Escalade")
Return JSON with mode and confidence (0-1)."""


async def classify_intent(qwen: QwenClient, query: str) -> IntentResult:
    return await qwen.generate(
        system=SYSTEM,
        user=query,
        response_model=IntentResult,
    )
