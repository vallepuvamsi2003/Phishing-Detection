
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.db.mongodb import db
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")



async def get_current_user():
    # Return a dummy user to bypass authentication
    return {
        "id": "guest_user_id",
        "email": "guest@example.com",
        "fullName": "Guest User",

        "role": "admin"

    }


