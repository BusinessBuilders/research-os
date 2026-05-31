import httpx
from fastapi import APIRouter, Depends

from core.config import Settings

router = APIRouter(tags=["health"])


@router.get("/api/health")
async def health(settings: Settings = Depends(lambda: Settings())):
    checks = {}
    async with httpx.AsyncClient(timeout=5.0) as client:
        for name, url in [
            ("vane", f"{settings.vane_url}/api/providers"),
            ("qwen", f"{settings.qwen_url}/v1/models"),
            ("firecrawl", f"{settings.firecrawl_url}/v1"),
        ]:
            try:
                r = await client.get(url)
                checks[name] = "ok" if r.status_code < 400 else f"status {r.status_code}"
            except httpx.RequestError as e:
                checks[name] = f"unreachable: {e.__class__.__name__}"

    all_ok = all(v == "ok" for v in checks.values())
    return {"status": "healthy" if all_ok else "degraded", "services": checks}
