from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.user import User
from typing import List, Optional

router = APIRouter()

@router.post("/sync")
def sync_user(
    userData: dict = Body(...), 
    db: Session = Depends(get_db)
):
    """
    Sync Supabase User metadata with the local 'users' database table.
    """
    try:
        supabase_id = userData.get("id")
        email = userData.get("email")
        metadata = userData.get("user_metadata", {})

        if not supabase_id or not email:
            raise HTTPException(status_code=400, detail="User ID and Email are required for sync")

        # 1. Check if user already exists by supabase_id
        db_user = db.query(User).filter(User.supabase_id == supabase_id).first()
        
        if not db_user:
            # Fallback to email check (if they migrated from a non-Supabase system)
            db_user = db.query(User).filter(User.email == email).first()
            if db_user:
                db_user.supabase_id = supabase_id
        
        if not db_user:
            # 2. Create new profile if not found
            username = email.split('@')[0]
            db_user = User(
                supabase_id=supabase_id,
                email=email,
                full_name=metadata.get("full_name", username),
                username=username,
                department=metadata.get("department"),
                experience_level=metadata.get("experience_level", "Beginner"),
                skills=metadata.get("skills", []),
                role=metadata.get("role", "learner")
            )
            db.add(db_user)
        else:
            # 3. Update existing profile with latest metadata
            db_user.full_name = metadata.get("full_name", db_user.full_name)
            db_user.department = metadata.get("department", db_user.department)
            db_user.experience_level = metadata.get("experience_level", db_user.experience_level)
            db_user.skills = metadata.get("skills", db_user.skills)

        db.commit()
        db.refresh(db_user)
        
        return {
            "status": "synced",
            "user_id": db_user.id,
            "role": db_user.role
        }
    except Exception as e:
        import traceback
        print("SYNC ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    # This will be refined to use the current user from JWT in Phase 6
    return {"message": "User profile endpoint"}
