from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..services.recommendation_service import RecommendationService
from ..agents.ld_coach_agent import ld_coach_agent
from ..agents.tracker_agent import tracker_agent

router = APIRouter()


class GapAnalysisRequest(BaseModel):
    current_skills: List[str]
    desired_role: str
    industry: Optional[str] = "Technology"
    experience_level: Optional[str] = "Intermediate"


class CoachChatRequest(BaseModel):
    user_id: Optional[str] = "0"
    history: List[Dict[str, str]]
    message: str


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


@router.post("/coach-chat")
def coach_chat(request: CoachChatRequest, db: Session = Depends(get_db)):
    # 1. Get user context from tracker
    try:
        user_id_int = int(request.user_id)
        user_context = tracker_agent.get_dashboard_summary(db, user_id_int)
    except (ValueError, TypeError, Exception):
        user_context = {}

    # 2. Append latest message to history
    full_history = request.history + [{"role": "user", "content": request.message}]
    
    # 3. Get AI response
    ai_response = ld_coach_agent.get_chat_response(full_history, user_context)
    
    return {"status": "success", "reply": ai_response}
