import asyncio
import os
import tempfile

# Must run before any test imports api.main — settings are read at import time
# (CORS middleware) and the repo would otherwise write researchos.db into the
# backend working directory.
_TEST_DB = os.path.join(tempfile.mkdtemp(prefix="researchos-test-"), "test.db")
os.environ.setdefault("RESEARCHOS_DB_PATH", _TEST_DB)

import pytest


@pytest.fixture(autouse=True, scope="session")
def _close_global_repo():
    """Close the module-global repo connection after the test session.

    aiosqlite's worker thread is non-daemon; an unclosed connection blocks
    interpreter shutdown and hangs the pytest process forever.
    """
    yield
    from api import deps

    if deps._repo is not None:
        asyncio.run(deps._repo.close())
        deps._repo = None


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
