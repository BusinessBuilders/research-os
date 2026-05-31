import pytest

from core.models import NeedResult, ProductCard
from db.repository import SessionRepository


@pytest.fixture
async def repo(tmp_path):
    db_path = str(tmp_path / "test.db")
    repo = SessionRepository(db_path)
    await repo.initialize()
    yield repo
    await repo.close()


async def test_save_and_get_need_results(repo):
    nr = NeedResult(
        session_id="s1",
        need_id="n1",
        need_description="servo driver board",
        status="complete",
        products=[
            ProductCard(
                name="PCA9685",
                price=14.95,
                source_url="https://adafruit.com",
                source_name="Adafruit",
                fit_score="strong",
                fit_rationale="Good PWM driver",
            )
        ],
    )
    await repo.save_need_result(nr)
    results = await repo.get_need_results("s1")
    assert len(results) == 1
    assert results[0].need_id == "n1"
    assert results[0].status == "complete"
    assert len(results[0].products) == 1


async def test_get_need_results_empty(repo):
    results = await repo.get_need_results("nonexistent")
    assert results == []


async def test_save_need_result_overwrites(repo):
    nr1 = NeedResult(session_id="s1", need_id="n1", need_description="test", status="searching")
    await repo.save_need_result(nr1)

    nr2 = NeedResult(session_id="s1", need_id="n1", need_description="test", status="complete",
                     products=[ProductCard(name="X", price=10.0, source_url="http://x", source_name="X", fit_score="strong", fit_rationale="ok")])
    await repo.save_need_result(nr2)

    results = await repo.get_need_results("s1")
    assert len(results) == 1
    assert results[0].status == "complete"
    assert len(results[0].products) == 1


async def test_find_incomplete_jobs(repo):
    from core.models import ResearchJob
    job1 = ResearchJob(job_id="j1", session_id="s1", status="searching")
    job2 = ResearchJob(job_id="j2", session_id="s2", status="complete")
    job3 = ResearchJob(job_id="j3", session_id="s3", status="evaluating")
    await repo.save_job(job1)
    await repo.save_job(job2)
    await repo.save_job(job3)

    incomplete = await repo.find_incomplete_jobs()
    assert len(incomplete) == 2
    ids = {j.job_id for j in incomplete}
    assert ids == {"j1", "j3"}
