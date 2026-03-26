from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.user import User
from ..models.otp import OTPVerification
from ..schemas.user_schema import UserCreate, UserResponse
from ..schemas.auth_schema import Token, TokenData
from ..auth.auth_handler import AuthHandler
from ..auth.password_utils import get_password_hash, verify_password
from ..utils.email_utils import send_otp_email
from pydantic import BaseModel
import random
import json

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email is already fully registered
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # 2. Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    
    # 3. Clean up previous unverified OTPs for this email to prevent db clutter
    db.query(OTPVerification).filter(OTPVerification.email == user_in.email).delete()
    
    # 4. Serialize UserCreate data 
    user_data = user_in.model_dump()
    
    # 5. Store pending verification
    pending_verification = OTPVerification(
        email=user_in.email,
        otp_code=otp_code,
        user_data_json=json.dumps(user_data)
    )
    db.add(pending_verification)
    db.commit()

    # 6. Send Email
    success = send_otp_email(user_in.email, otp_code)
    
    if not success:
        # Note: In development with no env vars, the script still returns True and prints to console.
        # This error only hits if SMTP actively fails.
        db.delete(pending_verification)
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to send verification email. Please try again.")

    return {"status": "success", "message": "OTP sent to email", "require_otp": True, "dev_otp": otp_code}

@router.post("/verify-otp", response_model=UserResponse)
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    # 1. Fetch pending verification
    verification = db.query(OTPVerification).filter(
        OTPVerification.email == request.email,
        OTPVerification.otp_code == request.otp_code
    ).first()

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    if verification.is_expired():
        db.delete(verification)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP code has expired. Please register again.")

    # 2. Parse User Data
    user_data = verification.get_user_data()
    user_in = UserCreate(**user_data)
    
    # 3. Create actual User
    hashed_password = get_password_hash(user_in.password)
    base_username = user_in.email.split('@')[0]
    
    # Validate username uniqueness
    existing_username = db.query(User).filter(User.username == base_username).first()
    if existing_username:
        base_username = f"{base_username}_{random.randint(100, 999)}"
    
    new_user = User(
        full_name=user_in.full_name,
        username=base_username,
        email=user_in.email,
        password_hash=hashed_password,
        department=user_in.department,
        experience_level=user_in.experience_level,
        skills=user_in.skills,
        role="learner" # Default role
    )
    db.add(new_user)
    
    # 4. Cleanup OTP mapping
    db.delete(verification)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = AuthHandler.create_token(user_id=str(user.id))
    return {
        "access_token": access_token["access_token"], 
        "token_type": "bearer", 
        "user": {
            "id": user.id, 
            "full_name": user.full_name, 
            "username": user.username,
            "email": user.email, 
            "department": user.department,
            "experience_level": user.experience_level,
            "skills": user.skills or [],
            "role": user.role
        }
    }
