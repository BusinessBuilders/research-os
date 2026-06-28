from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field, model_validator


def _id() -> str:
    return uuid.uuid4().hex[:12]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _is_safe_url(url: str) -> bool:
    return url.startswith("https://") or url.startswith("http://")


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
    community_note: str | None = None
    quality_score: float | None = None
    specs: dict[str, str] = Field(default_factory=dict)
    risks: list[str] = Field(default_factory=list)
    selected_for_purchase: bool = False

    @model_validator(mode="after")
    def _sanitize(self) -> "ProductCard":
        # LLM/web-extracted URLs: never let a non-http(s) scheme reach an href
        if self.source_url and not _is_safe_url(self.source_url):
            self.source_url = ""
        if self.image_url and not _is_safe_url(self.image_url):
            self.image_url = None
        # Clamp LLM-produced star ratings to the 1-5 half-step scale instead
        # of failing the whole evaluation on one bad value. The scale starts
        # at 1.0 — anything below (including 0 and NaN) means "no evidence",
        # which must render as no rating, not a fabricated worst rating.
        if self.quality_score is not None:
            clamped = round(min(5.0, max(0.0, self.quality_score)) * 2) / 2
            self.quality_score = clamped if clamped >= 1.0 else None
        return self


class Need(BaseModel):
    id: str = Field(default_factory=_id)
    description: str
    rationale: str
    priority: Literal["critical", "important", "nice-to-have"] = "important"
    estimated_cost_range: str = ""
    selected: bool = True
    products: list[ProductCard] = Field(default_factory=list)


class ApproachSource(BaseModel):
    title: str
    url: str


class MethodOption(BaseModel):
    name: str
    summary: str
    community_take: str = ""


class ApproachBrief(BaseModel):
    """Popular methods/approaches surfaced during gap analysis.

    Method text comes from the LLM; sources are attached server-side from
    the actual Vane search results — never LLM-generated URLs."""

    methods: list[MethodOption] = Field(default_factory=list)
    recommended: str = ""
    why: str = ""
    sources: list[ApproachSource] = Field(default_factory=list)

    @model_validator(mode="after")
    def _sanitize_sources(self) -> "ApproachBrief":
        self.sources = [s for s in self.sources if _is_safe_url(s.url)]
        return self


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
    approach: ApproachBrief | None = None
    status: Literal["created", "analyzing", "researching", "complete", "failed", "decided"] = "created"
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


class NeedResult(BaseModel):
    session_id: str
    need_id: str
    need_description: str
    status: Literal["pending", "searching", "evaluating", "complete", "failed"] = "pending"
    products: list[ProductCard] = Field(default_factory=list)
    error: str | None = None
    searched_at: datetime | None = None
