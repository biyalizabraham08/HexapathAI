from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timedelta
from ..db.database import Base
import json

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(minutes=10))
    user_data_json = Column(String, nullable=False) # Store the serialized UserCreate payload

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    def get_user_data(self):
        return json.loads(self.user_data_json)
