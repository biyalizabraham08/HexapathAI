from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from ..db.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    user_name = Column(String(255))
    user_email = Column(String(255))
    subject = Column(String(300))
    category = Column(String(100))        # bug, feature, question, feedback
    message = Column(Text)
    status = Column(String(50), default="open")  # open, in_progress, resolved, closed
    priority = Column(String(50), default="medium")  # low, medium, high, urgent
    admin_reply = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
