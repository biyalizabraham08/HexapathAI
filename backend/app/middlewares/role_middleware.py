from fastapi import Request, HTTPException

def verify_admin_role(request: Request):
    """
    Dependency to verify if the user has an admin role.
    """
    user_role = request.headers.get("X-User-Role", "learner")
    if user_role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return True
