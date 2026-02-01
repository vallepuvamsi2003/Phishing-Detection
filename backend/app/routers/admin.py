
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.schemas.user import User
from app.db.mongodb import db
from datetime import datetime, timedelta

router = APIRouter()

def check_admin(user: dict):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

@router.get("/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    
    total_scans = db.db.scans.count_documents({})
    phishing_scans = db.db.scans.count_documents({"result_class": "Phishing"})
    legit_scans = db.db.scans.count_documents({"result_class": "Legitimate"})
    
    # Get last 7 days stats
    days = []
    counts = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        start = datetime.combine(datetime.utcnow() - timedelta(days=i), datetime.min.time())
        end = datetime.combine(datetime.utcnow() - timedelta(days=i), datetime.max.time())
        count = db.db.scans.count_documents({"created_at": {"$gte": start, "$lte": end}})
        days.append(date)
        counts.append(count)
        
    return {
        "total_scans": total_scans,
        "phishing_detected": phishing_scans,
        "safe_scans": legit_scans,
        "active_users": db.db.users.count_documents({}),
        "daily_stats": {
            "labels": days,
            "data": counts
        }
    }

@router.get("/recent-threats")
async def get_recent_threats(current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    threats = list(db.db.scans.find({"result_class": "Phishing"}).sort("created_at", -1).limit(10))
    for threat in threats:
         threat["_id"] = str(threat["_id"])
    return threats
