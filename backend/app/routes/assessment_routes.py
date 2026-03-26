from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from ..agents.assessment_agent import assessment_agent

router = APIRouter()


class AssessmentRequest(BaseModel):
    skills: List[str]
    num_per_skill: Optional[int] = 3
    difficulty: Optional[str] = "Mixed"
    num_total: Optional[int] = 10


class SubmitAnswersRequest(BaseModel):
    questions: list
    answers: List[int]


@router.get("/")
def get_assessments():
    return {"message": "Use POST /generate to get skill-specific questions"}


@router.post("/generate")
def generate_assessment(request: AssessmentRequest):
    """Generate assessment questions based on skill gaps."""
    questions = assessment_agent.get_questions(
        skills=request.skills,
        num_total=request.num_total,
        difficulty=request.difficulty
    )
    return {"status": "success", "questions": questions, "total": len(questions) if questions else 0}


@router.post("/evaluate")
def evaluate_assessment(request: SubmitAnswersRequest):
    """Evaluate submitted answers and return real scores."""
    result = assessment_agent.evaluate_answers(
        questions=request.questions,
        user_answers=request.answers,
    )
    return {"status": "success", "result": result}


from fastapi import Depends
from ..db.database import get_db
from sqlalchemy.orm import Session
from ..models.assessments import AdaptiveSession
from ..agents.adaptive_agent import adaptive_agent
import json
import uuid

class StartAdaptiveRequest(BaseModel):
    user_id: int
    domain: str
    role: str
    skills: List[str]

class SubmitAdaptiveRequest(BaseModel):
    session_id: str
    is_correct: bool
    time_taken_seconds: int
    difficulty: str
    skill: str

@router.post("/adaptive/start")
def start_adaptive_session(request: StartAdaptiveRequest, db: Session = Depends(get_db)):
    """Initialize a new adaptive assessment session and generate the first question."""
    session_id = str(uuid.uuid4())
    session = AdaptiveSession(
        id=session_id,
        user_id=request.user_id,
        domain=request.domain,
        role=request.role,
        skills=",".join(request.skills),
        current_skill_index=0,
        history="[]",
        proficiency_scores="{}"
    )
    db.add(session)
    db.commit()
    
    # Generate the very first question
    current_skill = request.skills[0]
    question = adaptive_agent.generate_next_question(
        domain=request.domain, 
        role=request.role, 
        skill=current_skill, 
        history=[]
    )
    
    return {
        "status": "success", 
        "session_id": session_id,
        "current_skill": current_skill,
        "question": question
    }


@router.post("/adaptive/submit")
def submit_adaptive_answer(request: SubmitAdaptiveRequest, db: Session = Depends(get_db)):
    """Record an answer, update proficiency, and generate the next question."""
    session = db.query(AdaptiveSession).filter(AdaptiveSession.id == request.session_id).first()
    if not session:
        return {"status": "error", "message": "Session not found"}
        
    history = json.loads(session.history)
    history.append({
        "skill": request.skill,
        "is_correct": request.is_correct,
        "time_taken_seconds": request.time_taken_seconds,
        "difficulty": request.difficulty
    })
    session.history = json.dumps(history)
    
    # Update proficiency score for this skill
    proficiencies = json.loads(session.proficiency_scores)
    proficiencies[request.skill] = adaptive_agent.calculate_current_proficiency(request.skill, history)
    session.proficiency_scores = json.dumps(proficiencies)
    
    skills_list = [s.strip() for s in session.skills.split(",")]
    
    # Check if we should move to the next skill
    # Simple rule: move on after 5 questions per skill to allow deep leveling
    skill_history = [h for h in history if h.get("skill") == request.skill]
    if len(skill_history) >= 5:
        session.current_skill_index += 1
        
    db.commit()
    
    if session.current_skill_index >= len(skills_list):
        session.is_completed = 1
        db.commit()
        return {
            "status": "completed", 
            "proficiency_scores": proficiencies,
            "message": "Assessment Complete!"
        }
        
    # Generate next question
    next_skill = skills_list[session.current_skill_index]
    next_question = adaptive_agent.generate_next_question(
        domain=session.domain,
        role=session.role,
        skill=next_skill,
        history=history
    )
    
    return {
        "status": "success",
        "current_skill": next_skill,
        "proficiency": proficiencies.get(request.skill, "Needs Improvement"),
        "question": next_question
    }
