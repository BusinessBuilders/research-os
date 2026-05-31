from __future__ import annotations

import json
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from core.exceptions import QwenError

T = TypeVar("T", bound=BaseModel)


class QwenClient:
    def __init__(self, base_url: str, model: str = "", timeout: float = 120.0):
        self.base_url = base_url
        self.model = model
        self._client = httpx.AsyncClient(base_url=base_url, timeout=timeout)

    async def close(self):
        await self._client.aclose()

    async def generate(
        self,
        system: str,
        user: str,
        response_model: type[T],
        max_retries: int = 1,
    ) -> T:
        schema = response_model.model_json_schema()
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ]

        body = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 4096,
            "extra_body": {"guided_json": json.dumps(schema)},
        }

        for attempt in range(1 + max_retries):
            try:
                response = await self._client.post("/v1/chat/completions", json=body)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise QwenError(f"Qwen API call failed: {e}") from e

            data = response.json()
            content = data["choices"][0]["message"]["content"]

            try:
                return response_model.model_validate_json(content)
            except ValidationError as e:
                if attempt < max_retries:
                    messages.append({"role": "assistant", "content": content})
                    messages.append({
                        "role": "user",
                        "content": f"Your response failed validation:\n{e}\n\nPlease fix and return valid JSON matching the schema.",
                    })
                    continue
                raise QwenError(f"Qwen output failed validation after {1 + max_retries} attempts: {e}") from e

        raise QwenError("Unreachable")
