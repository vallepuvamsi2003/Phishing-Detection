
from flask import Flask, request, jsonify
from flask_cors import CORS
from app.db.mongodb import db
from app.ml.phishing_detector import phishing_detector
import uuid
from datetime import datetime

from app.routers.auth import auth_router

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_router, url_prefix="/api/v1/auth")

# Dummy current user for guest access (can be replaced by token logic later)
current_user = {
    "id": "guest_user_id",
    "email": "guest@example.com",
    "fullName": "Guest User",
    "role": "admin"
}

@app.before_request
def startup_db():
    db.connect()

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Welcome to the Phishing Detection System API (Flask)"})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

# Scan Routes
@app.route("/api/v1/scan/analyze", methods=["POST"])
def analyze_content():
    data = request.get_json()
    content = data.get("content")
    content_type = data.get("content_type")
    sender = data.get("sender", "")

    if not content:
        return jsonify({"detail": "Content cannot be empty"}), 400

    result = phishing_detector.predict(content, sender=sender, content_type=content_type)
    
    scan_doc = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "content": content,
        "sender": sender,
        "content_type": content_type,
        "result_class": result["verdict"],
        "risk_level": result["risk_level"],
        "risk_score": result["risk_score"],
        "ml_signal": result["ml_signal"],
        "reasoning_signal": result["reasoning_signal"],
        "threat_type": result["threat_type"],
        "indicators": result["indicators"],
        "action": result["action"],
        "created_at": datetime.utcnow()
    }
    
    # Save to MongoDB
    if db.db is not None:
        db.db.scans.insert_one(scan_doc)
    
    if "_id" in scan_doc:
        del scan_doc["_id"]
        
    return jsonify(scan_doc)


@app.route("/api/v1/scan/history", methods=["GET"])
def get_history():
    if db.db is None:
        return jsonify([])
    
    # Optional: filter by content_type if provided in query params
    content_type = request.args.get('content_type')
    query = {"user_id": current_user["id"]}
    if content_type:
        query["content_type"] = content_type

    scans = list(db.db.scans.find(query).sort("created_at", -1).limit(50))
    for scan in scans:
        if "_id" in scan:
            scan["_id"] = str(scan["_id"])
    return jsonify(scans)

@app.route("/api/v1/scan/delete/<scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    if db.db is None:
        return jsonify({"detail": "Database not connected"}), 500
    
    result = db.db.scans.delete_one({"id": scan_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        return jsonify({"detail": "Scan not found"}), 404
        
    return jsonify({"message": "Scan deleted successfully"})


# Admin Routes
@app.route("/api/v1/admin/stats", methods=["GET"])
def get_stats():
    if db.db is None:
        return jsonify({})
    
    total_scans = db.db.scans.count_documents({})
    phishing_scans = db.db.scans.count_documents({"result_class": "Phishing"})
    legit_scans = db.db.scans.count_documents({"result_class": "Legitimate"})
    
    # Get last 7 days stats
    from datetime import timedelta
    days = []
    counts = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        start = datetime.combine(datetime.utcnow() - timedelta(days=i), datetime.min.time())
        end = datetime.combine(datetime.utcnow() - timedelta(days=i), datetime.max.time())
        count = db.db.scans.count_documents({"created_at": {"$gte": start, "$lte": end}})
        days.append(date)
        counts.append(count)
        
    return jsonify({
        "total_scans": total_scans,
        "phishing_detected": phishing_scans,
        "safe_scans": legit_scans,
        "active_users": 1, # Fixed for guest mode
        "daily_stats": {
            "labels": days,
            "data": counts
        }
    })

@app.route("/api/v1/admin/recent-threats", methods=["GET"])
def get_recent_threats():
    if db.db is None:
        return jsonify([])
    
    threats = list(db.db.scans.find({"result_class": "Phishing"}).sort("created_at", -1).limit(10))
    for threat in threats:
         threat["_id"] = str(threat["_id"])
    return jsonify(threats)

if __name__ == "__main__":
    app.run(port=8000, debug=True)
