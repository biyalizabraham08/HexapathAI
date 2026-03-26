from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..agents.tracker_agent import tracker_agent

router = APIRouter()


class SaveAnalysisRequest(BaseModel):
    user_id: int
    analysis: dict
    learning_path: list


class SaveAssessmentRequest(BaseModel):
    user_id: int
    result: dict


class SaveCourseProgressRequest(BaseModel):
    user_id: int
    course_data: dict


@router.post("/save-analysis")
def save_analysis(request: SaveAnalysisRequest, db: Session = Depends(get_db)):
    record_id = tracker_agent.save_analysis(db, request.user_id, request.analysis, request.learning_path)
    return {"status": "success", "record_id": record_id}


@router.post("/save-assessment")
def save_assessment(request: SaveAssessmentRequest, db: Session = Depends(get_db)):
    record_id = tracker_agent.save_assessment(db, request.user_id, request.result)
    return {"status": "success", "record_id": record_id}


@router.post("/course-progress")
def save_course_progress(request: SaveCourseProgressRequest, db: Session = Depends(get_db)):
    record_id = tracker_agent.save_course_progress(db, request.user_id, request.course_data)
    return {"status": "success", "record_id": record_id}


@router.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):
    analyses = tracker_agent.get_progress_history(db, user_id)
    assessments = tracker_agent.get_assessment_history(db, user_id)
    courses = tracker_agent.get_course_history(db, user_id)
    return {"status": "success", "analyses": analyses, "assessments": assessments, "courses": courses}


@router.get("/dashboard/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    summary = tracker_agent.get_dashboard_summary(db, user_id)
    return {"status": "success", "data": summary}
