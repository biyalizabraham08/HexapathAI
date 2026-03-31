import os
from pydantic_settings import BaseSettings
from logging import getLogger
from typing import Optional

logger = getLogger(__name__)

class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./skill_gap.db"
    OPENROUTER_API_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: str = "your_supabase_jwt_secret_change_me"

    class Config:
        # Load .env from the backend root (one level up from app/config.py)
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        extra = "ignore"

settings = Settings()
if settings.OPENROUTER_API_KEY:
    logger.info("✅ OPENROUTER_API_KEY loaded successfully from .env")
else:
    logger.warning("🚨 OPENROUTER_API_KEY NOT found in .env")
