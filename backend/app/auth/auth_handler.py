from .jwt_handler import sign_jwt, decode_jwt
from .password_utils import verify_password, get_password_hash

# AuthHandler facade
class AuthHandler:
    @staticmethod
    def create_token(user_id: str):
        return sign_jwt(user_id)

    @staticmethod
    def verify_token(token: str):
        return decode_jwt(token)
