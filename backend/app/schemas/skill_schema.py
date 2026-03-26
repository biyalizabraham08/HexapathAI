from pydantic import BaseModel
from typing import Optional

class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True
