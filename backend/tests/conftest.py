import pytest


@pytest.fixture
def vane_providers_response():
    return [
        {
            "id": "test-provider-uuid",
            "name": "Test OpenAI",
            "chatModels": [{"key": "qwen-3.6-122b", "displayName": "Qwen 3.6"}],
            "embeddingModels": [{"key": "nomic-embed-text", "displayName": "Nomic"}],
        }
    ]


@pytest.fixture
def vane_search_response():
    return {
        "message": "The PCA9685 is a 16-channel PWM driver board. Adafruit sells it for $14.95.",
        "sources": [
            {
                "content": "PCA9685 16-Channel 12-bit PWM/Servo Driver",
                "metadata": {"title": "Adafruit PCA9685", "url": "https://adafruit.com/product/815"},
            },
            {
                "content": "Generic PCA9685 module available for $3.20",
                "metadata": {"title": "PCA9685 Module", "url": "https://aliexpress.com/item/123"},
            },
        ],
    }
