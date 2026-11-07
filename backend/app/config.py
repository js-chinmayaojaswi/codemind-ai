import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "CodeMind AI"
    APP_VERSION: str = "2.4.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./codemind.db"
    
    # Groq Cloud API
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Hindsight Memory Engine
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
    HINDSIGHT_API_KEY: Optional[str] = os.getenv("HINDSIGHT_API_KEY", None)
    HINDSIGHT_BANK_ID: str = "team-codemind"

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
