import os
from pydantic_settings import BaseSettings
from logging import getLogger

logger = getLogger(__name__)

class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./skill_gap.db"
    GEMINI_API_KEY: str | None = None

    class Config:
        # Load .env from the backend root (one level up from app/config.py)
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        extra = "ignore"

settings = Settings()
if settings.GEMINI_API_KEY:
    logger.info("✅ GEMINI_API_KEY loaded successfully from .env")
else:
    logger.warning("🚨 GEMINI_API_KEY NOT found in .env")
