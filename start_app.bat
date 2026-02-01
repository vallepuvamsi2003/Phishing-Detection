
@echo off
echo Starting Phishing Detection System...

:: Start Backend
start cmd /k "cd backend && if not exist venv (python -m venv venv) && call venv\Scripts\activate && pip install -r requirements.txt && python main.py"

:: Wait for backend to initialize
timeout /t 5

:: Start Frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo System started! 
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
pause
