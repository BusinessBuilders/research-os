from __future__ import annotations

import httpx

from core.exceptions import ResearchOSError


class FirecrawlClient:
    def __init__(self, base_url: str, timeout: float = 60.0):
        self._client = httpx.AsyncClient(base_url=base_url, timeout=timeout)

    async def close(self):
        await self._client.aclose()

    async def scrape(self, url: str) -> str:
        try:
            response = await self._client.post(
                "/v1/scrape",
                json={"url": url, "formats": ["markdown"]},
            )
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise ResearchOSError(f"Firecrawl scrape failed: {e}") from e

        data = response.json()
        return data.get("data", {}).get("markdown", "")
