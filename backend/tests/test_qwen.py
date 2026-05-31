import json
import httpx
import pytest

from core.models import IntentResult
from services.qwen import QwenClient


@pytest.fixture
def mock_qwen_transport():
    async def handler(request: httpx.Request):
        if request.url.path == "/v1/chat/completions":
            return httpx.Response(200, json={
                "choices": [{
                    "message": {
                        "content": json.dumps({
                            "mode": "goal-driven",
                            "confidence": 0.95,
                        })
                    }
                }]
            })
        return httpx.Response(404)

    return httpx.MockTransport(handler)


@pytest.fixture
async def qwen(mock_qwen_transport):
    client = QwenClient(base_url="http://test:8080")
    client._client = httpx.AsyncClient(transport=mock_qwen_transport, base_url="http://test:8080")
    yield client
    await client.close()


async def test_structured_output(qwen):
    result = await qwen.generate(
        system="Classify this query.",
        user="upgrade my robotics fab setup",
        response_model=IntentResult,
    )
    assert isinstance(result, IntentResult)
    assert result.mode == "goal-driven"
    assert result.confidence == 0.95
