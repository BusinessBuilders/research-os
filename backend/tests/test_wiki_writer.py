import pytest
from pathlib import Path

from core.models import Decision, ProductCard, ResearchSession
from services.wiki_writer import WikiWriter


@pytest.fixture
def wiki_writer(tmp_path):
    template_dir = Path(__file__).parent.parent / "templates"
    return WikiWriter(wiki_path=str(tmp_path), template_dir=str(template_dir))


@pytest.fixture
def sample_session():
    return ResearchSession(goal="upgrade robotics fab", budget=500.0)


@pytest.fixture
def sample_decision():
    return Decision(
        session_id="test-session",
        decision_date="2026-06-01",
        project_slug="project-eve-humanoid-robot",
        needs_addressed=["servo-driver-board"],
        selected_products=[
            ProductCard(
                name="Adafruit PCA9685",
                price=14.95,
                source_url="https://adafruit.com/product/815",
                source_name="Adafruit",
                fit_score="strong",
                fit_rationale="16-channel PWM driver, Python library",
            ),
        ],
        total_cost=14.95,
        budget_category="robotics-rd",
        rationale="Need a servo driver for multi-servo arrays.",
        alternatives_considered=3,
    )


def test_generate_decision_page_contains_frontmatter(wiki_writer, sample_session, sample_decision):
    content = wiki_writer.generate_decision_page(sample_session, sample_decision, sample_decision.selected_products)
    assert "date: \"2026-06-01\"" in content
    assert "type: decision" in content
    assert "project: project-eve-humanoid-robot" in content
    assert "researchos:" in content


def test_generate_decision_page_contains_template_sections(wiki_writer, sample_session, sample_decision):
    content = wiki_writer.generate_decision_page(sample_session, sample_decision, sample_decision.selected_products)
    assert "## The Situation" in content
    assert "## Options Considered" in content
    assert "## The Choice" in content
    assert "## Outcome" in content
    assert "## Connections (Idea Compass)" in content


def test_write_decision_page_creates_file(wiki_writer, sample_session, sample_decision, tmp_path):
    path = wiki_writer.write_decision_page(sample_session, sample_decision, sample_decision.selected_products)
    assert path.exists()
    assert path.name == "decision-2026-06-01-servo-driver-board.md"
    content = path.read_text()
    assert "Adafruit PCA9685" in content
