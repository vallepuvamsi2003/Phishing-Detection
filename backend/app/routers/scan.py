
from fastapi import APIRouter, Depends, HTTPException
from app.ml.phishing_detector import phishing_detector
from app.dependencies import get_current_user
from app.schemas.user import User
from app.schemas.scan import ScanResult, ScanBase
from app.db.mongodb import db
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/analyze", response_model=ScanResult)
async def analyze_content(request: ScanBase, current_user: dict = Depends(get_current_user)):
    if not request.content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    
    # Simple heuristic to determine if it's a URL if not explicitly provided
    # (Though the frontend should specify content_type)
    
    result = phishing_detector.predict(request.content)
    
    scan_doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"] if current_user else None,
        "content": request.content,
        "content_type": request.content_type,
        "result_class": result["class"],
        "confidence": result["confidence"],
        "details": result["details"],
        "created_at": datetime.utcnow()
    }
    
    # Save to MongoDB
    db.db.scans.insert_one(scan_doc)
    
    return scan_doc

@router.get("/history", response_model=list[ScanResult])
async def get_history(current_user: dict = Depends(get_current_user)):
    scans = list(db.db.scans.find({"user_id": current_user["id"]}).sort("created_at", -1).limit(50))
    return scans
