from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime
from ..db.database import get_db
from ..models.support import SupportTicket

router = APIRouter()


class CreateTicketRequest(BaseModel):
    user_id: int
    user_name: str
    user_email: str
    subject: str
    category: str  # bug, feature, question, feedback
    message: str
    priority: Optional[str] = "medium"


class ReplyTicketRequest(BaseModel):
    admin_reply: str
    status: Optional[str] = "resolved"


# ── User endpoints ──────────────────────────

@router.post("/tickets")
def create_ticket(request: CreateTicketRequest, db: Session = Depends(get_db)):
    """User creates a new support ticket."""
    ticket = SupportTicket(
        user_id=request.user_id,
        user_name=request.user_name,
        user_email=request.user_email,
        subject=request.subject,
        category=request.category,
        message=request.message,
        priority=request.priority,
        status="open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"status": "success", "ticket_id": ticket.id, "message": "Ticket created successfully"}


@router.get("/tickets/user/{user_id}")
def get_user_tickets(user_id: int, db: Session = Depends(get_db)):
    """Fetch all tickets for a specific user."""
    tickets = (
        db.query(SupportTicket)
        .filter(SupportTicket.user_id == user_id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )
    return {
        "status": "success",
        "tickets": [
            {
                "id": t.id,
                "subject": t.subject,
                "category": t.category,
                "message": t.message,
                "status": t.status,
                "priority": t.priority,
                "admin_reply": t.admin_reply,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None,
            }
            for t in tickets
        ],
    }


# ── Admin endpoints ─────────────────────────

@router.get("/tickets/all")
def get_all_tickets(db: Session = Depends(get_db)):
    """Fetch all tickets (admin view)."""
    tickets = db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).all()
    return {
        "status": "success",
        "tickets": [
            {
                "id": t.id,
                "user_id": t.user_id,
                "user_name": t.user_name,
                "user_email": t.user_email,
                "subject": t.subject,
                "category": t.category,
                "message": t.message,
                "status": t.status,
                "priority": t.priority,
                "admin_reply": t.admin_reply,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None,
            }
            for t in tickets
        ],
    }


@router.put("/tickets/{ticket_id}/reply")
def reply_ticket(ticket_id: int, request: ReplyTicketRequest, db: Session = Depends(get_db)):
    """Admin replies to a ticket and updates status."""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        return {"status": "error", "message": "Ticket not found"}
    ticket.admin_reply = request.admin_reply
    ticket.status = request.status
    ticket.updated_at = datetime.utcnow()
    db.commit()
    return {"status": "success", "message": "Ticket updated successfully"}
