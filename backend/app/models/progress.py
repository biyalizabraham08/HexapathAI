from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from datetime import datetime
from ..db.database import Base


class ProgressRecord(Base):
    __tablename__ = "progress_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    desired_role = Column(String(150))
    industry = Column(String(100))
    experience_level = Column(String(50))
    career_fit_pct = Column(Float, default=0)
    total_hard_gaps = Column(Integer, default=0)
    total_soft_gaps = Column(Integer, default=0)
    hard_gaps = Column(JSON, default=list)
    soft_gaps = Column(JSON, default=list)
    hard_matches = Column(JSON, default=list)
    soft_matches = Column(JSON, default=list)
    learning_path = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    score = Column(Float, default=0)
    passed = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    per_skill = Column(JSON, default=dict)
    feedback = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)


class CourseProgress(Base):
    __tablename__ = "course_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    course_id = Column(String(100), index=True)
    course_name = Column(String(255))
    platform = Column(String(100))
    total_modules = Column(Integer, default=5)
    completed_modules = Column(Integer, default=0)
    completion_pct = Column(Float, default=0)
    status = Column(String(50), default="In Progress") # Not Started, In Progress, Completed
    last_accessed = Column(DateTime, default=datetime.utcnow)

