from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from ..services.recommendation_service import RecommendationService

router = APIRouter()


class GapAnalysisRequest(BaseModel):
    current_skills: List[str]
    desired_role: str
    industry: Optional[str] = "Technology"
    experience_level: Optional[str] = "Intermediate"


@router.get("/paths")
def get_learning_paths():
    return {"message": "Learning paths endpoint"}


@router.post("/analyze-gap")
def analyze_skill_gap(request: GapAnalysisRequest):
    analysis_report = RecommendationService.analyze_skill_gap(
        current_skills=request.current_skills,
        desired_role=request.desired_role,
        industry=request.industry,
        experience_level=request.experience_level,
    )
    return {"status": "success", "data": analysis_report}
