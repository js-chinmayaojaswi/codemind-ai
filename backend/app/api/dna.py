from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.team_dna import TeamProfileResponse, StatsSummaryResponse
from app.services.dna_service import dna_service

router = APIRouter(prefix="/dna", tags=["Team DNA"])

@router.get("/profile", response_model=TeamProfileResponse)
def get_team_profile(db: Session = Depends(get_db)):
    """
    Returns the synthesized Team Coding DNA profile including radar metrics and learned rules.
    """
    return dna_service.get_profile(db)

@router.get("/stats", response_model=StatsSummaryResponse)
def get_stats(db: Session = Depends(get_db)):
    """
    Returns high-level KPI stats (reviews processed, precision rate, rules learned, bugs prevented).
    """
    return dna_service.get_stats(db)
