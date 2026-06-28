import json
import httpx
import pytest

from services.gap_analyzer import analyze_gaps
from services.qwen import QwenClient


@pytest.fixture
def mock_gap_transport():
    async def handler(request: httpx.Request):
        return httpx.Response(200, json={
            "choices": [{
                "message": {
                    "content": json.dumps({
                        "approach": {
                            "methods": [
                                {
                                    "name": "Tendon-driven",
                                    "summary": "Cables route force from remote servos.",
                                    "community_take": "r/robotics favorite for compact hands",
                                },
                                {
                                    "name": "Direct-drive",
                                    "summary": "Servo per joint.",
                                    "community_take": "Simpler but bulky",
                                },
                            ],
                            "recommended": "Tendon-driven",
                            "why": "Compact and matches the project context.",
                        },
                        "needs": [
                            {
                                "description": "Servo driver board (PCA9685)",
                                "rationale": "No PWM controller for multi-servo arrays",
                                "priority": "critical",
                                "estimated_cost_range": "$5-$20",
                            },
                            {
                                "description": "Digital servos (6x, 25kg-cm+)",
                                "rationale": "No precision actuators in current setup",
                                "priority": "critical",
                                "estimated_cost_range": "$50-$100",
                            },
                        ]
                    })
                }
            }]
        })
    return httpx.MockTransport(handler)


@pytest.fixture
async def qwen(mock_gap_transport):
    client = QwenClient(base_url="http://test:8080")
    client._client = httpx.AsyncClient(transport=mock_gap_transport, base_url="http://test:8080")
    yield client
    await client.close()


async def test_analyze_gaps_returns_needs(qwen):
    analysis = await analyze_gaps(
        qwen=qwen,
        goal="build tendon-driven robot hand actuators",
        equipment="CNC 3018, MIG welder, Ender 3 v2, soldering station",
        wiki_context="EVE robot project — arm first, custom actuators",
        budget=500.0,
    )
    assert len(analysis.needs) == 2
    assert analysis.needs[0].description == "Servo driver board (PCA9685)"
    assert analysis.needs[0].priority == "critical"


async def test_analyze_gaps_returns_approach(qwen):
    analysis = await analyze_gaps(
        qwen=qwen,
        goal="build tendon-driven robot hand actuators",
        equipment="",
        wiki_context="",
        budget=None,
    )
    a = analysis.approach
    assert a is not None
    assert a.recommended == "Tendon-driven"
    assert len(a.methods) == 2
    assert a.methods[1].community_take == "Simpler but bulky"
    # No vane passed → no sources; LLM can never produce source links
    assert a.sources == []
