"""
SQLAlchemy ORM Data Models.
"""
from .user import User
from .skills import Skill
from .courses import Course
from .assessments import Assessment
from .progress import ProgressRecord, AssessmentRecord
from .support import SupportTicket
from .otp import OTPVerification

__all__ = [
    "User",
    "Skill",
    "Course",
    "Assessment",
    "ProgressRecord",
    "AssessmentRecord",
    "SupportTicket",
    "OTPVerification",
]
