
# PhishGuard AI - Manual Execution Guide

Follow these steps to run the Phishing Detection system manually if the automated scripts are not used.

## Prerequisites
- Python 3.10+
- Node.js & npm
- MongoDB (Running locally or on Atlas)

---

## 1. Backend Setup (Flask API)
Open a new terminal/command prompt:

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python main.py
```
*The backend will run on `http://localhost:8000`.*

---

## 2. Frontend Setup (React + Vite)
Open another terminal:

```powershell
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

---

## 3. Database Check
The system requires MongoDB to store scan history. Ensure your MongoDB service is running:
- **Windows**: Check "Services" for `MongoDB`.
- **Command Line**: `Get-Service -Name MongoDB` (Powershell)

---

## System Architecture Intel
- **AI Core**: Uses Scikit-learn (Random Forest) for weighted probability analysis.
- **V5 Engine**: Combines ML Confidence (70%) with Heuristic Reasoning (30%) to reduce False Positives.
- **Real-Time Layer**: Intercepts URLs and extracts TLD/Domain features before processing.
