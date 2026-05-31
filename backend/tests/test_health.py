import pytest
from httpx import ASGITransport, AsyncClient

from api.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def test_health_returns_status(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert "status" in body
    assert "services" in body
    assert "vane" in body["services"]
    assert "qwen" in body["services"]
    assert "firecrawl" in body["services"]
