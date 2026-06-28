from __future__ import annotations

import asyncio
import os
from functools import lru_cache

from core.config import Settings
from db.repository import SessionRepository
from services.firecrawl_client import FirecrawlClient
from services.qwen import QwenClient
from services.vane_client import VaneClient
from services.wiki_reader import WikiReader
from services.wiki_writer import WikiWriter


@lru_cache
def get_settings() -> Settings:
    return Settings()


_repo: SessionRepository | None = None
_repo_lock: asyncio.Lock = asyncio.Lock()


async def get_repo() -> SessionRepository:
    global _repo
    if _repo is None:
        async with _repo_lock:
            if _repo is None:
                settings = get_settings()
                repo = SessionRepository(settings.db_path)
                await repo.initialize()
                _repo = repo
    return _repo


_vane: VaneClient | None = None


def get_vane() -> VaneClient:
    global _vane
    if _vane is None:
        s = get_settings()
        _vane = VaneClient(
            base_url=s.vane_url,
            chat_provider_id=s.vane_chat_provider_id,
            chat_model_key=s.vane_chat_model_key,
            embed_provider_id=s.vane_embed_provider_id,
            embed_model_key=s.vane_embed_model_key,
        )
    return _vane


_qwen: QwenClient | None = None


def get_qwen() -> QwenClient:
    global _qwen
    if _qwen is None:
        s = get_settings()
        _qwen = QwenClient(base_url=s.qwen_url, model=s.qwen_model)
    return _qwen


def get_wiki_reader() -> WikiReader:
    return WikiReader(get_settings().wiki_path)


def get_wiki_writer() -> WikiWriter:
    s = get_settings()
    template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
    return WikiWriter(wiki_path=s.wiki_path, template_dir=template_dir)


def get_firecrawl() -> FirecrawlClient:
    return FirecrawlClient(get_settings().firecrawl_url)
