# DEMO SCENARIO 1: High-Impact Concurrency Anti-Pattern
# Background: In Incident INC-402, this exact pattern starved the uvicorn event loop 
# under 2,000 req/sec, causing a 14-minute payment checkout outage.

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, UserModel

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    # ❌ ANTI-PATTERN 1: Synchronous Session in async route blocks the entire thread
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # ❌ ANTI-PATTERN 2: Route handlers must not commit transactions directly
    # Team invariant: UnitOfWork middleware manages commit on HTTP 200
    db.commit()
    
    return {"id": user.id, "username": user.username, "role": user.role}
