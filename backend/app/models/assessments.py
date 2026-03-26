from sqlalchemy import Column, Integer, String, ForeignKey
from ..db.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    max_score = Column(Integer, default=100)

class AdaptiveSession(Base):
    __tablename__ = "adaptive_sessions"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    domain = Column(String(255))
    role = Column(String(255))
    skills = Column(String(1000)) # comma separated list of skills being tested
    current_skill_index = Column(Integer, default=0)
    history = Column(String, default="[]") # JSON string of previously answered questions
    proficiency_scores = Column(String, default="{}") # JSON string of current inferred proficiency per skill
    is_completed = Column(Integer, default=0) # 0 or 1
    created_at = Column(String(50))
