from fastapi import APIRouter, Depends

from api.deps import get_wiki_reader
from services.wiki_reader import WikiReader

router = APIRouter(tags=["equipment"])


@router.get("/api/equipment")
async def get_equipment(wiki: WikiReader = Depends(get_wiki_reader)):
    return {"inventory": wiki.read_equipment_inventory()}


@router.get("/api/decisions")
async def list_decisions(wiki: WikiReader = Depends(get_wiki_reader)):
    return {"decisions": wiki.list_decision_pages()}


@router.get("/api/projects")
async def list_projects(wiki: WikiReader = Depends(get_wiki_reader)):
    return {"projects": wiki.list_project_pages()}
