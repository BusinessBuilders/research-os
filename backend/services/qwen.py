from __future__ import annotations

import json
import re
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from core.exceptions import QwenError

T = TypeVar("T", bound=BaseModel)


def _strip_markdown_fences(text: str) -> str:
    stripped = re.sub(r"^```(?:json)?\s*\n?", "", text.strip())
    stripped = re.sub(r"\n?```\s*$", "", stripped)
    return stripped.strip()


class QwenClient:
    def __init__(self, base_url: str, model: str = "", timeout: float = 600.0):
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
        max_retries: int = 2,
    ) -> T:
        schema = response_model.model_json_schema()
        messages = [
            {"role": "system", "content": system + "\n\nRespond with raw JSON only. No markdown, no code fences."},
            {"role": "user", "content": user},
        ]

        body = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 16384,
            "response_format": {"type": "json_object"},
        }

        for attempt in range(1 + max_retries):
            try:
                response = await self._client.post("/v1/chat/completions", json=body)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise QwenError(f"Qwen API call failed: {e}") from e

            data = response.json()
            content = data["choices"][0]["message"].get("content") or ""
            if not content.strip():
                if attempt < max_retries:
                    messages.append({"role": "user", "content": "You returned an empty response. Return ONLY valid JSON matching the schema."})
                    continue
                raise QwenError("Qwen returned empty content after retries")
            content = _strip_markdown_fences(content)

            try:
                return response_model.model_validate_json(content)
            except ValidationError as e:
                if attempt < max_retries:
                    messages.append({"role": "assistant", "content": content})
                    messages.append({
                        "role": "user",
                        "content": f"Your response failed validation:\n{e}\n\nReturn ONLY valid JSON matching the schema. No markdown fences.",
                    })
                    continue
                raise QwenError(f"Qwen output failed validation after {1 + max_retries} attempts: {e}") from e

        raise QwenError("Unreachable")
