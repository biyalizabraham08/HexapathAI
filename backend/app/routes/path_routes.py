from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ..utils.ai_provider import ai_client

router = APIRouter()

class CareerPathRequest(BaseModel):
    goal: str

@router.post("/generate-path")
def generate_career_path(request: CareerPathRequest):
    """
    Dedicated endpoint for career roadmap generation (Mistral 7B).
    Returns a structured career path or a high-quality fallback.
    """
    path_data = ai_client.generate_career_path(request.goal)
    return {"status": "success", "data": path_data}
