
# PhishGuard AI - Real-Time Phishing Detection System

A premium, AI-powered cybersecurity solution built for a hackathon. This system uses Machine Learning (Random Forest) and NLP (TF-IDF) to detect phishing URLs and email content in real-time.

## 🚀 Features

- **Real-Time AI Scanning**: Instant analysis of URLs and text content using a trained ML model.
- **Advanced Dashboard**: User-friendly interface for scanning and viewing historical threat logs.
- **Admin Intelligence Center**: High-level analytics and threat monitoring charts (powered by Recharts).
- **Premium Design**: Modern "Glassmorphism" UI with dark mode, smooth animations, and high-quality typography.
- **Secure Authentication**: JWT-based auth with Google OAuth integration and role-based access control.
- **History Tracking**: Automatically saves and displays user scan history from MongoDB.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Lucide React, Recharts, Axios.
- **Backend**: FastAPI (Python), Scikit-Learn, Joblib, MongoDB (Motor/PyMongo).
- **ML Model**: Random Forest Classifier with TF-IDF Vectorization (94% Accuracy).
- **Database**: MongoDB for users, scans, and analytical data.

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python train_model.py # Trains the ML model on 500k+ records
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛡️ Admin Access
The first user registered on the platform is automatically granted **Admin** privileges. Alternatively, any user with "admin" in their email prefix (e.g., `admin@example.com`) will receive admin rights.

## 🧠 ML Insights
The system uses a dataset of over 500,000 URLs to learn malicious patterns. Unlike static blacklists, PhishGuard AI analyzes the semantic structure and behavioral traits of content to identify never-before-seen threats.

---
Built with ❤️ for the Hackathon.
