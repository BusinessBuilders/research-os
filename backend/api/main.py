import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.deps import get_qwen, get_repo, get_vane, get_wiki_reader
from api.routes import equipment, health, sessions
from services.orchestrator import recover_incomplete_jobs

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(level=logging.INFO)
    repo = await get_repo()
    qwen = get_qwen()
    vane = get_vane()
    wiki = get_wiki_reader()
    count = await recover_incomplete_jobs(repo, qwen, vane, wiki)
    if count:
        logger.info(f"Recovered {count} incomplete research jobs")
    yield


app = FastAPI(title="ResearchOS", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(sessions.router)
app.include_router(equipment.router)
