from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.review import (
    ReviewRequest, 
    ReviewResult, 
    ReviewComparisonResponse,
    MistakePredictionRequest,
    MistakePredictionResponse,
    ReviewRecord,
    ReviewFindingRecord
)
from app.services.review_service import review_service
from app.services.predictor_service import predictor_service

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/predict", response_model=MistakePredictionResponse)
def predict_mistake(payload: MistakePredictionRequest):
    """
    Real-time proactive prediction endpoint invoked as developer types in Monaco.
    """
    return predictor_service.predict(payload.code, payload.language)

@router.post("/analyze", response_model=ReviewResult)
def analyze_code(payload: ReviewRequest, db: Session = Depends(get_db)):
    """
    Analyzes submitted code using CodeMind AI.
    """
    result = review_service.analyze(
        code=payload.code, 
        language=payload.language, 
        mode=payload.mode or "augmented"
    )

    # Persist review audit
    record = ReviewRecord(
        mode=result.mode,
        summary=result.summary,
        score=result.score,
        execution_time_ms=result.execution_time_ms,
        recalled_memories_count=result.recalled_memories_count or 0
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    for item in result.items:
        finding = ReviewFindingRecord(
            review_id=record.id,
            line_start=item.line_start,
            line_end=item.line_end,
            severity=item.severity,
            category=item.category,
            title=item.title,
            message=item.message,
            suggestion=item.suggestion,
            rule_citation=item.rule_citation,
            memory_origin=item.memory_origin,
            confidence=item.confidence
        )
        db.add(finding)
    db.commit()

    return result

@router.post("/compare", response_model=ReviewComparisonResponse)
def compare_reviews(payload: ReviewRequest):
    """
    Runs dual-stream evaluation: Generic LLM vs Hindsight-Augmented LLM.
    """
    return review_service.compare(code=payload.code, language=payload.language)
