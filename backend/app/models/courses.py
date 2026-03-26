from sqlalchemy import Column, Integer, String, Text, ForeignKey
from ..db.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    target_skill_id = Column(Integer, ForeignKey("skills.id"))
