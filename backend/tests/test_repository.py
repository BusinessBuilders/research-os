import pytest

from db.repository import SessionRepository


@pytest.fixture
async def repo(tmp_path):
    db_path = str(tmp_path / "test.db")
    repo = SessionRepository(db_path)
    await repo.initialize()
    yield repo
    await repo.close()


async def test_create_and_get_session(repo):
    from core.models import ResearchSession
    session = ResearchSession(goal="test goal")
    await repo.save_session(session)
    loaded = await repo.get_session(session.id)
    assert loaded is not None
    assert loaded.goal == "test goal"


async def test_list_sessions(repo):
    from core.models import ResearchSession
    await repo.save_session(ResearchSession(goal="a"))
    await repo.save_session(ResearchSession(goal="b"))
    sessions = await repo.list_sessions()
    assert len(sessions) == 2


async def test_get_missing_session_returns_none(repo):
    result = await repo.get_session("nonexistent")
    assert result is None
