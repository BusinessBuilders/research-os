from __future__ import annotations

import aiosqlite

from core.models import ResearchSession, ResearchJob
from db.database import init_db


class SessionRepository:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._conn: aiosqlite.Connection | None = None

    async def initialize(self):
        await init_db(self.db_path)
        self._conn = await aiosqlite.connect(self.db_path)
        self._conn.row_factory = aiosqlite.Row

    async def close(self):
        if self._conn:
            await self._conn.close()

    async def save_session(self, session: ResearchSession) -> None:
        await self._conn.execute(
            "INSERT OR REPLACE INTO sessions (id, data, created_at) VALUES (?, ?, ?)",
            (session.id, session.model_dump_json(), session.created_at.isoformat()),
        )
        await self._conn.commit()

    async def get_session(self, session_id: str) -> ResearchSession | None:
        cursor = await self._conn.execute(
            "SELECT data FROM sessions WHERE id = ?", (session_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return ResearchSession.model_validate_json(row["data"])

    async def list_sessions(self) -> list[ResearchSession]:
        cursor = await self._conn.execute(
            "SELECT data FROM sessions ORDER BY created_at DESC"
        )
        rows = await cursor.fetchall()
        return [ResearchSession.model_validate_json(r["data"]) for r in rows]

    async def save_job(self, job: ResearchJob) -> None:
        await self._conn.execute(
            "INSERT OR REPLACE INTO jobs (job_id, session_id, data) VALUES (?, ?, ?)",
            (job.job_id, job.session_id, job.model_dump_json()),
        )
        await self._conn.commit()

    async def get_job(self, session_id: str) -> ResearchJob | None:
        cursor = await self._conn.execute(
            "SELECT data FROM jobs WHERE session_id = ? ORDER BY rowid DESC LIMIT 1",
            (session_id,),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return ResearchJob.model_validate_json(row["data"])
