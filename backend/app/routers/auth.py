
from flask import Blueprint, request, jsonify
from app.db.mongodb import db
from app.helpers.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from google.oauth2 import id_token
from google.auth.transport import requests
import uuid
from datetime import datetime

auth_router = Blueprint('auth', __name__)

@auth_router.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("fullName", "User")

    if not email or not password:
        return jsonify({"detail": "Email and password are required"}), 400

    if db.db.users.find_one({"email": email}):
        return jsonify({"detail": "Email already registered"}), 400

    new_user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "fullName": full_name,
        "password": get_password_hash(password),
        "role": "user",
        "avatar": None,
        "created_at": datetime.utcnow()
    }

    db.db.users.insert_one(new_user)
    
    # Create Token
    access_token = create_access_token(data={"sub": new_user["id"], "email": new_user["email"]})
    
    # Return user without password
    user_response = {k: v for k, v in new_user.items() if k not in ["password", "_id"]}
    
    return jsonify({
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    })

@auth_router.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = db.db.users.find_one({"email": email})
    if not user or not user.get("password") or not verify_password(password, user["password"]):
        return jsonify({"detail": "Invalid credentials"}), 401

    access_token = create_access_token(data={"sub": user["id"], "email": user["email"]})
    
    user_response = {k: v for k, v in user.items() if k not in ["password", "_id"]}
    
    return jsonify({
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    })

@auth_router.route("/google", methods=["POST"])
def google_login():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({"detail": "Token is required"}), 400

    try:
        # Verify Google Token
        id_info = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
        
        email = id_info.get("email")
        name = id_info.get("name")
        picture = id_info.get("picture")
        google_id = id_info.get("sub")

        user = db.db.users.find_one({"email": email})
        
        if not user:
            # Create new user
            user = {
                "id": str(uuid.uuid4()),
                "email": email,
                "fullName": name,
                "google_id": google_id,
                "avatar": picture,
                "role": "user",
                "created_at": datetime.utcnow()
            }
            db.db.users.insert_one(user)
        else:
            # Update existing user with google info if needed
            updates = {}
            if "google_id" not in user:
                updates["google_id"] = google_id
            if "avatar" not in user or not user["avatar"]:
                updates["avatar"] = picture
            if updates:
                db.db.users.update_one({"_id": user["_id"]}, {"$set": updates})
                # refetch to get updated fields
                user = db.db.users.find_one({"_id": user["_id"]})

        access_token = create_access_token(data={"sub": user["id"], "email": user["email"]})
        
        user_response = {k: v for k, v in user.items() if k not in ["password", "_id"]}
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        })

    except ValueError:
        return jsonify({"detail": "Invalid Google Token"}), 401
