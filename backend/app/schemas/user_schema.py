from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    experience_level: str
    skills: List[str]

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    username: str

    class Config:
        from_attributes = True
