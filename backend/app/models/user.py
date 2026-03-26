from sqlalchemy import Column, Integer, String, JSON
from ..db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255))
    username = Column(String(100), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    department = Column(String(100))
    experience_level = Column(String(50))
    skills = Column(JSON, default=list) # Store multiselect skills
    role = Column(String(50), default="learner")
