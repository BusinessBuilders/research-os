from core.models import (
    ResearchSession, Need, ProductCard, DirectLookupResult,
    Citation, Decision, ResearchJob, IntentResult, SynthesisResult,
)


def test_research_session_defaults():
    session = ResearchSession(goal="test goal")
    assert session.mode == "product-research"
    assert session.status == "created"
    assert session.needs == []
    assert session.budget is None


def test_product_card_requires_name_and_fit():
    card = ProductCard(
        name="Test Product",
        source_url="https://example.com",
        source_name="Example",
        fit_score="strong",
        fit_rationale="Good fit",
        currency="USD",
    )
    assert card.price is None
    assert card.selected_for_purchase is False


def test_direct_lookup_result():
    result = DirectLookupResult(
        answer="Part number is 18B4958",
        confidence=0.95,
        part_numbers=["18B4958"],
        citations=[Citation(title="AutoZone", url="https://autozone.com/...", snippet="Brake caliper")],
        fitment="2009 Cadillac Escalade",
    )
    assert len(result.citations) == 1


def test_research_job_status_transitions():
    job = ResearchJob(job_id="j1", session_id="s1")
    assert job.status == "queued"
    assert job.needs_completed == 0


def test_intent_result():
    result = IntentResult(mode="goal-driven", confidence=0.92)
    assert result.mode in ("goal-driven", "product-research", "direct-lookup")
