import json
import httpx
import pytest

from services.product_evaluator import evaluate_products
from services.qwen import QwenClient
from services.vane_client import VaneSearchResult, VaneSource


@pytest.fixture
def mock_eval_transport():
    async def handler(request: httpx.Request):
        return httpx.Response(200, json={
            "choices": [{
                "message": {
                    "content": json.dumps({
                        "products": [
                            {
                                "name": "Adafruit PCA9685",
                                "price": 14.95,
                                "source_url": "https://adafruit.com/815",
                                "source_name": "Adafruit",
                                "fit_score": "strong",
                                "fit_rationale": "16-channel I2C PWM driver with Python library",
                                "currency": "USD",
                            }
                        ]
                    })
                }
            }]
        })
    return httpx.MockTransport(handler)


@pytest.fixture
async def qwen(mock_eval_transport):
    client = QwenClient(base_url="http://test:8080")
    client._client = httpx.AsyncClient(transport=mock_eval_transport, base_url="http://test:8080")
    yield client
    await client.close()


async def test_evaluate_products_returns_cards(qwen):
    vane_result = VaneSearchResult(
        message="The PCA9685 is a 16-channel PWM driver.",
        sources=[VaneSource(title="Adafruit", url="https://adafruit.com/815", content="PCA9685 driver")],
    )
    cards = await evaluate_products(qwen, "Servo driver board", vane_result)
    assert len(cards) == 1
    assert cards[0].name == "Adafruit PCA9685"
    assert cards[0].fit_score == "strong"
