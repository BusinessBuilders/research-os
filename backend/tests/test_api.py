import pytest
from httpx import ASGITransport, AsyncClient

from api.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def test_create_and_list_sessions(client):
    response = await client.post("/api/sessions", json={
        "goal": "find brake caliper for 09 Escalade",
        "mode": "direct-lookup",
    })
    assert response.status_code == 200
    session = response.json()
    assert session["mode"] == "direct-lookup"
    assert session["goal"] == "find brake caliper for 09 Escalade"

    response = await client.get("/api/sessions")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) >= 1


async def test_get_nonexistent_session(client):
    response = await client.get("/api/sessions/nonexistent")
    assert response.status_code == 404
