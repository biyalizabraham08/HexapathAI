from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Basic placeholder for JWT validation logic
        # if not request.headers.get("Authorization"):
        #     return JSONResponse(status_code=401, content={"detail": "Missing Auth Token"})
        response = await call_next(request)
        return response
