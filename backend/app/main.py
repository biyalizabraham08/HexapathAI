from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_routes, user_routes, assessment_routes, learning_routes, admin_routes, tracking_routes, support_routes
from .db.database import engine, Base
from .models import *  # noqa: F401,F403 — ensure all models register with Base

app = FastAPI(title="HEXAPATH AI API", version="1.0.0")

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(assessment_routes.router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(learning_routes.router, prefix="/api/learning", tags=["Learning"])
app.include_router(admin_routes.router, prefix="/api/admin", tags=["Admin"])
app.include_router(tracking_routes.router, prefix="/api/tracking", tags=["Tracking"])
app.include_router(support_routes.router, prefix="/api/support", tags=["Support"])

@app.get("/")
def read_root():
    return {"message": "Welcome to HEXAPATH AI Backend Server"}
