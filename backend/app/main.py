from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.api.health import router as health_router
from app.api.reviews import router as reviews_router
from app.api.feedback import router as feedback_router
from app.api.dna import router as dna_router

# Initialize database schema
init_db()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Self-Learning Agentic Code Review Engine with Explicit Team Memory (Hindsight SDK + Groq)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for React / Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router, prefix="/api")
app.include_router(reviews_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")
app.include_router(dna_router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
