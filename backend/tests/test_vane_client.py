import httpx
import pytest

from services.vane_client import VaneClient


@pytest.fixture
def mock_transport(vane_providers_response, vane_search_response):
    async def handler(request: httpx.Request):
        if request.url.path == "/api/providers":
            return httpx.Response(200, json=vane_providers_response)
        if request.url.path == "/api/search":
            return httpx.Response(200, json=vane_search_response)
        return httpx.Response(404)

    return httpx.MockTransport(handler)


@pytest.fixture
async def vane(mock_transport):
    client = VaneClient(
        base_url="http://test:3000",
        chat_provider_id="test-provider-uuid",
        chat_model_key="qwen-3.6-122b",
        embed_provider_id="test-provider-uuid",
        embed_model_key="nomic-embed-text",
    )
    client._client = httpx.AsyncClient(transport=mock_transport, base_url="http://test:3000")
    yield client
    await client.close()


async def test_search_returns_message_and_sources(vane):
    result = await vane.search("PCA9685 servo driver board")
    assert "PCA9685" in result.message
    assert len(result.sources) == 2
    assert result.sources[0].url == "https://adafruit.com/product/815"


async def test_search_with_system_instructions(vane):
    result = await vane.search(
        "servo driver",
        system_instructions="Focus on price and availability.",
        optimization_mode="quality",
    )
    assert result.message
