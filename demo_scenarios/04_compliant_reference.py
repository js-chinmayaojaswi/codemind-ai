# DEMO SCENARIO 4: Fully Compliant Enterprise Architecture
# Conforms to all recalled team rules from Hindsight memory bank 'team-codemind'.

import logging
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config import settings
from database import get_async_db, UserModel
import httpx

logger = logging.getLogger(__name__)
app = FastAPI()

# ✅ Compliant with Rule #104: Default arguments initialized with None
def create_telemetry_payload(batch: List[dict], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    ctx = context.copy() if context else {}
    ctx["count"] = len(batch)
    return ctx

# ✅ Compliant with Rule #101 & Rule #108: AsyncSession with scalars & no route-level commit
@app.get("/users/{user_id}", response_model=dict)
async def get_user_profile(
    user_id: int, 
    db: AsyncSession = Depends(get_async_db)
):
    query = select(UserModel).where(UserModel.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
        
    return {"id": user.id, "username": user.username, "role": user.role}

# ✅ Compliant with Rule #106: Outbound HTTP request with explicit timeout
async def send_audit_event(event_data: dict) -> bool:
    async with httpx.AsyncClient(timeout=httpx.Timeout(5.0)) as client:
        try:
            resp = await client.post("https://audit.internal/v1/events", json=event_data)
            return resp.status_code == 200
        # ✅ Compliant with Rule #103: Catch specific exception hierarchy & log traceback
        except httpx.HTTPError as exc:
            logger.exception("Failed to dispatch audit log event: %s", exc)
            return False
