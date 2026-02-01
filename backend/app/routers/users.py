
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import UserCreate, User
from app.core.security import get_password_hash
from app.db.mongodb import db
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/signup", response_model=User)
async def signup(user: UserCreate):
    if db.db is None:
        db.connect()
        if db.db is None:
            raise HTTPException(status_code=500, detail="Database connection error")

    try:
        user_exists = db.db.users.find_one({"email": user.email})
        if user_exists:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_count = db.db.users.count_documents({})
        role = "admin" if user_count == 0 or "admin" in user.email.split('@')[0] else "user"
        
        from datetime import datetime
        user_data = user.model_dump()
        user_data["password"] = get_password_hash(user_data["password"])
        user_data["role"] = role
        user_data["authProvider"] = "local"
        user_data["createdAt"] = datetime.utcnow()
        user_data["is_active"] = True
        
        result = db.db.users.insert_one(user_data)
        user_data["id"] = str(result.inserted_id)
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@router.get("/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    current_user["id"] = str(current_user["_id"])
    return current_user
