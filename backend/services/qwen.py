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
        system_full = (
            system
            + "\n\nRespond with raw JSON only. No markdown, no code fences."
            + "\n\nYour JSON MUST match this schema exactly:\n"
            + json.dumps(schema)
        )

        last_error: str = ""
        for _attempt in range(1 + max_retries):
            # Fresh messages each attempt — appending failed outputs grows the
            # request every retry, which compounds thinking-model truncation
            messages = [
                {"role": "system", "content": system_full},
                {"role": "user", "content": user},
            ]
            if last_error:
                messages.append({
                    "role": "user",
                    "content": (
                        "Your previous response was rejected: "
                        f"{last_error[:800]}\n"
                        "Return ONLY valid JSON matching the schema. No markdown fences."
                    ),
                })

            body = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 16384,
                "response_format": {"type": "json_object"},
            }

            try:
                response = await self._client.post("/v1/chat/completions", json=body)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise QwenError(f"Qwen API call failed: {e}") from e

            try:
                data = response.json()
                content = data["choices"][0]["message"].get("content") or ""
            except (ValueError, KeyError, IndexError, TypeError) as e:
                last_error = f"malformed completion response: {e}"
                continue
            if not content.strip():
                last_error = "empty response"
                continue
            content = _strip_markdown_fences(content)

            try:
                return response_model.model_validate_json(content)
            except ValidationError as e:
                last_error = f"failed schema validation: {e}"
                continue

        raise QwenError(
            f"Qwen output invalid after {1 + max_retries} attempts: {last_error[:500]}"
        )
