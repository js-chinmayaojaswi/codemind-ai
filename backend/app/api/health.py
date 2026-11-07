from fastapi import APIRouter
from app.config import settings
from app.services.groq_service import groq_service
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def get_health():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "active_bank_id": settings.HINDSIGHT_BANK_ID,
        "groq_configured": groq_service.is_configured(),
        "hindsight_configured": hindsight_service.is_configured(),
    }
