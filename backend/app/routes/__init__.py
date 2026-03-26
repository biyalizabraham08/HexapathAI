"""
API Routers for the application.
"""
from . import auth_routes, user_routes, assessment_routes, learning_routes, admin_routes, tracking_routes, support_routes

__all__ = [
    "auth_routes",
    "user_routes",
    "assessment_routes",
    "learning_routes",
    "admin_routes",
    "tracking_routes",
    "support_routes",
]
