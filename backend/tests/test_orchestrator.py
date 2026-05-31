import json
import httpx
import pytest

from core.models import Need, ResearchJob, ResearchSession
from db.repository import SessionRepository
from services.orchestrator import run_research_pipeline
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader


@pytest.fixture
def mock_all_transport():
    async def handler(request: httpx.Request):
        path = str(request.url.path)
        if "/api/search" in path:
            return httpx.Response(200, json={
                "message": "Found PCA9685 for $14.95",
                "sources": [{"content": "PCA9685", "metadata": {"title": "Adafruit", "url": "https://adafruit.com"}}],
            })
        if "/v1/chat/completions" in path:
            return httpx.Response(200, json={
                "choices": [{"message": {"content": json.dumps({
                    "products": [
                        {"name": "PCA9685", "price": 14.95, "source_url": "https://adafruit.com",
                         "source_name": "Adafruit", "fit_score": "strong", "fit_rationale": "Good", "currency": "USD"}
                    ]
                })}}]
            })
        return httpx.Response(404)
    return httpx.MockTransport(handler)


@pytest.fixture
async def services(mock_all_transport, tmp_path):
    repo = SessionRepository(str(tmp_path / "test.db"))
    await repo.initialize()

    qwen = QwenClient(base_url="http://test:8080")
    qwen._client = httpx.AsyncClient(transport=mock_all_transport, base_url="http://test:8080")

    vane = VaneClient(
        base_url="http://test:3000",
        chat_provider_id="p", chat_model_key="m",
        embed_provider_id="p", embed_model_key="e",
    )
    vane._client = httpx.AsyncClient(transport=mock_all_transport, base_url="http://test:3000")

    wiki = WikiReader(str(tmp_path))

    yield repo, qwen, vane, wiki

    await qwen.close()
    await vane.close()
    await repo.close()


async def test_research_pipeline_completes(services):
    repo, qwen, vane, wiki = services

    session = ResearchSession(
        goal="test goal",
        needs=[Need(description="servo driver board", rationale="need PWM control")],
    )
    await repo.save_session(session)

    job = ResearchJob(session_id=session.id)
    await repo.save_job(job)

    result = await run_research_pipeline(session, job, repo, qwen, vane, wiki)
    assert result.status == "complete"
    assert len(result.needs[0].products) >= 1

    saved_job = await repo.get_job(session.id)
    assert saved_job.status == "complete"
