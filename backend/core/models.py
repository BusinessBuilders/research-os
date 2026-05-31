from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


def _id() -> str:
    return uuid.uuid4().hex[:12]


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Citation(BaseModel):
    title: str
    url: str
    snippet: str


class ProductCard(BaseModel):
    id: str = Field(default_factory=_id)
    name: str
    price: float | None = None
    currency: str = "USD"
    source_url: str
    source_name: str
    image_url: str | None = None
    fit_score: Literal["strong", "partial", "poor"]
    fit_rationale: str
    specs: dict[str, str] = Field(default_factory=dict)
    risks: list[str] = Field(default_factory=list)
    selected_for_purchase: bool = False


class Need(BaseModel):
    id: str = Field(default_factory=_id)
    description: str
    rationale: str
    priority: Literal["critical", "important", "nice-to-have"] = "important"
    estimated_cost_range: str = ""
    selected: bool = True
    products: list[ProductCard] = Field(default_factory=list)


class DirectLookupResult(BaseModel):
    answer: str
    confidence: float
    part_numbers: list[str] = Field(default_factory=list)
    citations: list[Citation] = Field(default_factory=list)
    fitment: str | None = None


class ResearchSession(BaseModel):
    id: str = Field(default_factory=_id)
    created_at: datetime = Field(default_factory=_now)
    goal: str
    mode: Literal["goal-driven", "product-research", "direct-lookup"] = "product-research"
    budget: float | None = None
    wiki_context: list[str] = Field(default_factory=list)
    needs: list[Need] = Field(default_factory=list)
    status: Literal["created", "analyzing", "researching", "complete", "decided"] = "created"
    lookup_result: DirectLookupResult | None = None


class Decision(BaseModel):
    session_id: str
    decision_date: str
    project_slug: str | None = None
    needs_addressed: list[str] = Field(default_factory=list)
    selected_products: list[ProductCard] = Field(default_factory=list)
    total_cost: float = 0.0
    budget_category: str | None = None
    rationale: str = ""
    alternatives_considered: int = 0


class ResearchJob(BaseModel):
    job_id: str = Field(default_factory=_id)
    session_id: str
    status: Literal[
        "queued", "searching", "evaluating", "synthesizing",
        "complete", "failed", "cancelled"
    ] = "queued"
    current_need: str | None = None
    current_round: int = 0
    needs_completed: int = 0
    needs_total: int = 0
    error: str | None = None
    started_at: datetime | None = None
    timeout_seconds: int = 300


class IntentResult(BaseModel):
    mode: Literal["goal-driven", "product-research", "direct-lookup"]
    confidence: float


class SynthesisResult(BaseModel):
    recommendation: str
    shopping_list: list[dict]
    total_cost: float
    deferred_items: list[dict] = Field(default_factory=list)
