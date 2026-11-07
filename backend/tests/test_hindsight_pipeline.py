import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.services.hindsight_service import hindsight_service

SAMPLE_ASYNC_CODE = """
@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(UserModel).first()
"""

SAMPLE_SQL_CODE = """
def fetch_logs(tenant: str):
    cursor.execute(f"SELECT * FROM logs WHERE tenant = '{tenant}'")
"""

def test_query_formulation():
    query_async = hindsight_service.formulate_query(SAMPLE_ASYNC_CODE)
    assert "FastAPI async route concurrency" in query_async
    assert "SQLAlchemy" in query_async

    query_sql = hindsight_service.formulate_query(SAMPLE_SQL_CODE)
    assert "SQL injection" in query_sql

def test_hindsight_retain_operation():
    content = "Always pass connection timeout parameter to httpx AsyncClient."
    result = hindsight_service.retain_memory(
        content=content,
        context="Developer Seed Convention",
        tags=["http", "concurrency", "resilience"],
        metadata={"priority": "high"}
    )
    assert result["success"] is True
    assert "memory_id" in result
    assert result["bank_id"] == "team-codemind"

def test_hindsight_recall_operation():
    memories = hindsight_service.recall_memories(SAMPLE_ASYNC_CODE)
    assert len(memories) > 0
    assert any("AsyncSession" in m["content"] for m in memories)
    assert any("Rule #101" in m["content"] for m in memories)

def test_hindsight_recall_security():
    memories = hindsight_service.recall_memories(SAMPLE_SQL_CODE)
    assert len(memories) > 0
    assert any("Rule #102" in m["content"] for m in memories)
    assert any("SQL" in m["content"] for m in memories)
