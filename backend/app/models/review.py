import uuid
from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# --- SQLAlchemy Models ---

class ReviewRecord(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    mode = Column(String(20), nullable=False) # 'generic' or 'augmented'
    code_hash = Column(String(64), nullable=True)
    summary = Column(Text, nullable=False)
    score = Column(Integer, default=100)
    execution_time_ms = Column(Integer, default=0)
    recalled_memories_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    findings = relationship("ReviewFindingRecord", back_populates="review", cascade="all, delete-orphan")


class ReviewFindingRecord(Base):
    __tablename__ = "review_findings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id = Column(String(36), ForeignKey("reviews.id"))
    line_start = Column(Integer, default=1)
    line_end = Column(Integer, default=1)
    severity = Column(String(20), default="warning") # error, warning, suggestion, info
    category = Column(String(50), default="architecture")
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=True)
    rule_citation = Column(String(255), nullable=True)
    memory_origin = Column(Text, nullable=True)
    confidence = Column(Integer, default=90)
    created_at = Column(DateTime, default=datetime.utcnow)

    review = relationship("ReviewRecord", back_populates="findings")


# --- Pydantic Schemas ---

class ReviewItem(BaseModel):
    id: str = Field(default_factory=lambda: f"item-{uuid.uuid4().hex[:8]}")
    line_start: int
    line_end: int
    severity: Literal["error", "warning", "info", "suggestion"]
    category: str
    title: str
    message: str
    suggestion: Optional[str] = None
    rule_citation: Optional[str] = None
    memory_origin: Optional[str] = None
    confidence: int = 90


class ReviewResult(BaseModel):
    id: str = Field(default_factory=lambda: f"rev-{uuid.uuid4().hex[:8]}")
    mode: Literal["generic", "augmented"]
    summary: str
    score: int
    items: List[ReviewItem]
    recalled_memories_count: Optional[int] = 0
    execution_time_ms: int = 0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class ReviewRequest(BaseModel):
    code: str
    language: str = "python"
    mode: Optional[Literal["generic", "augmented"]] = "augmented"


class ReviewComparisonResponse(BaseModel):
    generic_review: ReviewResult
    augmented_review: ReviewResult
    memory_lift_summary: str
    rules_enforced: List[str]


class MistakePredictionRequest(BaseModel):
    code: str
    language: str = "python"


class MistakePredictionResponse(BaseModel):
    detected: bool
    title: str = ""
    explanation: str = ""
    historical_occurrences: int = 0
    prevention_tip: str = ""
    severity: Literal["warning", "error", "info"] = "info"
    related_rule: Optional[str] = None
