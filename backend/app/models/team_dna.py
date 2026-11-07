import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from app.database import Base

class TeamRuleRecord(Base):
    __tablename__ = "team_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rule_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    confidence_score = Column(Integer, default=95)
    frequency_applied = Column(Integer, default=1)
    source = Column(String(50), default="developer_feedback")
    created_at = Column(DateTime, default=datetime.utcnow)


class TeamRuleModel(BaseModel):
    id: str
    rule_name: str
    description: str
    category: str
    confidence_score: int
    frequency_applied: int
    created_at: str
    source: str


class TeamDnaMetricModel(BaseModel):
    category: str
    score: int
    fullMark: int = 100


class TeamProfileResponse(BaseModel):
    team_name: str
    bank_id: str
    total_rules_learned: int
    bug_prevention_rate: float
    metrics: List[TeamDnaMetricModel]
    rules: List[TeamRuleModel]


class StatsSummaryResponse(BaseModel):
    total_reviews: int
    active_rules: int
    precision_rate: float
    bugs_prevented: int
