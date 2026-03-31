import time
from jose import jwt
from typing import Dict
from ..config import settings

def sign_jwt(user_id: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {"access_token": token}

def decode_jwt(token: str) -> dict:
    try:
        # First attempt to decode using our own SECRET_KEY (if we issued it)
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return decoded_token if decoded_token["expires"] >= time.time() else None
        except:
            # Fallback to Supabase JWT verification if configured
            if settings.SUPABASE_JWT_SECRET and settings.SUPABASE_JWT_SECRET != "your_supabase_jwt_secret_change_me":
                decoded_token = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"], audience="authenticated")
                # Supabase uses 'sub' for user_id and 'exp' for expiration
                if decoded_token.get("exp") >= time.time():
                    return {
                        "user_id": decoded_token.get("sub"),
                        "email": decoded_token.get("email"),
                        "supabase": True
                    }
            return {}
    except Exception as e:
        print(f"JWT Decode Error: {e}")
        return {}
