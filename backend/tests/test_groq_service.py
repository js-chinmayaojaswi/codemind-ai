import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app.services.groq_service import groq_service, GENERIC_SYSTEM_PROMPT
from app.services.review_service import review_service

SAMPLE_CODE = """
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    db.commit()
    return user
"""

def test_groq_service_clean_json_response():
    # Test raw JSON
    raw = '{"summary": "Test", "score": 90, "items": []}'
    parsed = groq_service._clean_json_response(raw)
    assert parsed["summary"] == "Test"
    assert parsed["score"] == 90

    # Test Markdown wrapped JSON
    wrapped = '```json\n{"summary": "Wrapped", "score": 85, "items": []}\n```'
    parsed_wrapped = groq_service._clean_json_response(wrapped)
    assert parsed_wrapped["summary"] == "Wrapped"

def test_groq_service_review_generic():
    result = groq_service.review_code_generic(SAMPLE_CODE, "python")
    assert result.mode == "generic"
    assert result.score > 0
    assert result.execution_time_ms >= 0
    assert isinstance(result.items, list)

def test_groq_service_review_augmented():
    memories = [
        {
            "id": "mem-101",
            "content": "FastAPI async endpoints must use AsyncSession; sync Session blocks event loop.",
            "score": 0.98
        }
    ]
    result = groq_service.review_code_augmented(SAMPLE_CODE, "python", recalled_memories=memories)
    assert result.mode == "augmented"
    assert result.score > 0
    assert result.execution_time_ms >= 0
    assert len(result.items) > 0

def test_review_service_compare_pipeline():
    comp = review_service.compare(SAMPLE_CODE, "python")
    assert comp.generic_review.mode == "generic"
    assert comp.augmented_review.mode == "augmented"
    assert len(comp.rules_enforced) > 0
    assert "Hindsight Memory augmented" in comp.memory_lift_summary
