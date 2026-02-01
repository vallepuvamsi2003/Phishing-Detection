
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    fullName: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: Optional[str] = None
    fullName: Optional[str] = None
    role: str = "user"
    is_active: bool = True
    authProvider: Optional[str] = "local"

    class Config:
        from_attributes = True
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
