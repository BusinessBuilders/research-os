"""Tests for the 2026-06-10 code-review fixes and quality-star/price features."""
from __future__ import annotations

import asyncio

import pytest

from core.models import NeedResult, ProductCard, ResearchJob
from db.repository import SessionRepository
from services.orchestrator import _is_scrapeable_product_url
from services.product_evaluator import _extract_price_hints
from services.wiki_reader import WikiReader


# --- ProductCard sanitization -------------------------------------------------

def _card(**overrides) -> ProductCard:
    base = dict(
        name="Test Product",
        source_url="https://amazon.com/dp/B0TEST",
        source_name="Amazon",
        fit_score="strong",
        fit_rationale="Fits.",
    )
    base.update(overrides)
    return ProductCard(**base)


def test_product_card_blocks_javascript_source_url():
    card = _card(source_url="javascript:alert(1)")
    assert card.source_url == ""


def test_product_card_keeps_https_source_url():
    card = _card()
    assert card.source_url == "https://amazon.com/dp/B0TEST"


def test_product_card_nullifies_bad_image_url():
    card = _card(image_url="data:text/html,<script>alert(1)</script>")
    assert card.image_url is None


def test_quality_score_clamped_and_rounded_to_half_steps():
    assert _card(quality_score=7.3).quality_score == 5.0
    assert _card(quality_score=-2).quality_score == 0.0
    assert _card(quality_score=4.3).quality_score == 4.5
    assert _card(quality_score=None).quality_score is None


# --- Price hint extraction ------------------------------------------------------

def test_extract_price_hints_finds_dollar_amounts():
    md = "Buy now for $1,299.00 (was $1,499.00). Shipping USD 12.50."
    hints = _extract_price_hints(md)
    assert "1,299.00" in hints
    assert "1,499.00" in hints
    assert "12.50" in hints


def test_extract_price_hints_dedupes_and_limits():
    md = " ".join(f"${i}.99" for i in range(20)) + " $5.99 $5.99"
    hints = _extract_price_hints(md, limit=5)
    assert len(hints) == 5
    assert len(set(hints)) == 5


def test_extract_price_hints_empty_when_no_prices():
    assert _extract_price_hints("no prices here at all") == []


# --- Scrape URL allowlist -------------------------------------------------------

def test_scrape_allowlist_exact_host():
    assert _is_scrapeable_product_url("https://www.amazon.com/dp/B0TEST")
    assert _is_scrapeable_product_url("https://ebay.com/itm/123")


def test_scrape_allowlist_rejects_substring_tricks():
    assert not _is_scrapeable_product_url("https://evil.com/amazon.com")
    assert not _is_scrapeable_product_url("https://amazon.com.attacker.tld/dp/x")
    assert not _is_scrapeable_product_url("javascript:amazon.com")
    assert not _is_scrapeable_product_url("ftp://amazon.com/file")


# --- WikiReader containment -----------------------------------------------------

def test_wiki_reader_blocks_path_traversal(tmp_path):
    wiki = tmp_path / "wiki"
    wiki.mkdir()
    secret = tmp_path / "secret.md"
    secret.write_text("TOP SECRET", encoding="utf-8")
    (wiki / "project-good.md").write_text("safe content", encoding="utf-8")

    reader = WikiReader(str(wiki))
    assert reader.read_project_page("../secret") == ""
    assert reader.read_project_page("../../etc/passwd") == ""
    assert "safe content" in reader.read_project_page("project-good")


# --- Repository: superseded jobs + concurrent writes ----------------------------

@pytest.fixture
async def repo(tmp_path):
    r = SessionRepository(str(tmp_path / "test.db"))
    await r.initialize()
    yield r
    await r.close()


async def test_find_incomplete_jobs_only_latest_per_session(repo):
    old = ResearchJob(session_id="s1", status="searching")
    await repo.save_job(old)
    old.status = "cancelled"
    old.error = "Superseded by retry"
    await repo.save_job(old)
    new = ResearchJob(session_id="s1", status="searching")
    await repo.save_job(new)

    incomplete = await repo.find_incomplete_jobs()
    assert [j.job_id for j in incomplete] == [new.job_id]


async def test_find_incomplete_jobs_skips_finished(repo):
    for status in ("complete", "failed", "cancelled"):
        await repo.save_job(ResearchJob(session_id=f"s-{status}", status=status))
    assert await repo.find_incomplete_jobs() == []


async def test_concurrent_need_result_writes(repo):
    async def write(i: int):
        nr = NeedResult(
            session_id="s1",
            need_id=f"need-{i}",
            need_description=f"need {i}",
            status="complete",
        )
        await repo.save_need_result(nr)

    await asyncio.gather(*(write(i) for i in range(25)))
    results = await repo.get_need_results("s1")
    assert len(results) == 25
