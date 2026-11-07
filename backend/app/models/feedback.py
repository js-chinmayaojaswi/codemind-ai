import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Text, DateTime
from app.database import Base

class FeedbackAuditRecord(Base):
    __tablename__ = "feedback_audit"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id = Column(String(36), nullable=False)
    item_id = Column(String(36), nullable=False)
    action = Column(String(20), nullable=False) # 'accept', 'reject', 'teach'
    rejection_reason = Column(Text, nullable=True)
    new_rule_content = Column(Text, nullable=True)
    hindsight_memory_id = Column(String(64), nullable=True)
    status = Column(String(20), default="retained")
    created_at = Column(DateTime, default=datetime.utcnow)


class FeedbackCreate(BaseModel):
    review_id: str
    item_id: str
    action: Literal["accept", "reject", "teach"]
    rejection_reason: Optional[str] = None
    new_rule_content: Optional[str] = None


class FeedbackResponse(BaseModel):
    success: bool
    memory_id: Optional[str] = None
    action: str
    message: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
