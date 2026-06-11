from __future__ import annotations

import asyncio

import aiosqlite

from core.models import NeedResult, ResearchJob, ResearchSession
from db.database import init_db


class SessionRepository:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._conn: aiosqlite.Connection | None = None
        # Serializes execute+commit pairs: batched research runs several
        # coroutines that write through this one shared connection
        self._write_lock = asyncio.Lock()

    async def initialize(self):
        await init_db(self.db_path)
        self._conn = await aiosqlite.connect(self.db_path)
        self._conn.row_factory = aiosqlite.Row
        await self._conn.execute("PRAGMA journal_mode=WAL")
        await self._conn.execute("PRAGMA busy_timeout=5000")

    async def close(self):
        if self._conn:
            await self._conn.close()

    async def save_session(self, session: ResearchSession) -> None:
        # Upsert (not INSERT OR REPLACE): REPLACE deletes + reinserts, which
        # assigns a new rowid and breaks "latest by rowid" ordering on jobs
        async with self._write_lock:
            await self._conn.execute(
                """
                INSERT INTO sessions (id, data, created_at) VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET data = excluded.data
                """,
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
        async with self._write_lock:
            await self._conn.execute(
                """
                INSERT INTO jobs (job_id, session_id, data) VALUES (?, ?, ?)
                ON CONFLICT(job_id) DO UPDATE SET data = excluded.data
                """,
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

    async def get_job_by_id(self, job_id: str) -> ResearchJob | None:
        cursor = await self._conn.execute(
            "SELECT data FROM jobs WHERE job_id = ?", (job_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return ResearchJob.model_validate_json(row["data"])

    async def save_need_result(self, nr: NeedResult) -> None:
        async with self._write_lock:
            await self._conn.execute(
                """
                INSERT INTO need_results (session_id, need_id, data) VALUES (?, ?, ?)
                ON CONFLICT(session_id, need_id) DO UPDATE SET data = excluded.data
                """,
                (nr.session_id, nr.need_id, nr.model_dump_json()),
            )
            await self._conn.commit()

    async def get_need_results(self, session_id: str) -> list[NeedResult]:
        cursor = await self._conn.execute(
            "SELECT data FROM need_results WHERE session_id = ? ORDER BY rowid",
            (session_id,),
        )
        rows = await cursor.fetchall()
        return [NeedResult.model_validate_json(r["data"]) for r in rows]

    async def find_incomplete_jobs(self) -> list[ResearchJob]:
        # Only the latest job per session counts — older rows are superseded
        # by retries and must not be re-spawned on startup
        cursor = await self._conn.execute(
            """
            SELECT data FROM jobs
            WHERE rowid IN (SELECT MAX(rowid) FROM jobs GROUP BY session_id)
              AND json_extract(data, '$.status') NOT IN ('complete', 'failed', 'cancelled')
            """
        )
        rows = await cursor.fetchall()
        return [ResearchJob.model_validate_json(r["data"]) for r in rows]
