from sqlalchemy.orm import Session
from .database import engine, Base
from ..models.user import User
from ..models.skills import Skill
from ..models.courses import Course
from ..models.assessments import Assessment

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized.")

if __name__ == "__main__":
    init_db()
