from __future__ import annotations

from dataclasses import dataclass

import httpx

from core.exceptions import VaneError


@dataclass
class VaneSource:
    title: str
    url: str
    content: str


@dataclass
class VaneSearchResult:
    message: str
    sources: list[VaneSource]


class VaneClient:
    def __init__(
        self,
        base_url: str,
        chat_provider_id: str,
        chat_model_key: str,
        embed_provider_id: str,
        embed_model_key: str,
        timeout: float = 120.0,
    ):
        self.base_url = base_url
        self.chat_provider_id = chat_provider_id
        self.chat_model_key = chat_model_key
        self.embed_provider_id = embed_provider_id
        self.embed_model_key = embed_model_key
        self._client = httpx.AsyncClient(base_url=base_url, timeout=timeout)

    async def close(self):
        await self._client.aclose()

    async def search(
        self,
        query: str,
        optimization_mode: str = "balanced",
        sources: list[str] | None = None,
        system_instructions: str | None = None,
    ) -> VaneSearchResult:
        body: dict = {
            "chatModel": {
                "providerId": self.chat_provider_id,
                "key": self.chat_model_key,
            },
            "embeddingModel": {
                "providerId": self.embed_provider_id,
                "key": self.embed_model_key,
            },
            "optimizationMode": optimization_mode,
            "sources": sources or ["web"],
            "query": query,
            "stream": False,
        }
        if system_instructions:
            body["systemInstructions"] = system_instructions

        try:
            response = await self._client.post("/api/search", json=body)
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise VaneError(f"Vane search failed: {e}") from e

        data = response.json()
        vane_sources = []
        for src in data.get("sources", []):
            meta = src.get("metadata", {})
            vane_sources.append(VaneSource(
                title=meta.get("title", ""),
                url=meta.get("url", ""),
                content=src.get("content", ""),
            ))

        return VaneSearchResult(message=data.get("message", ""), sources=vane_sources)
