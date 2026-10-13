@echo off
title AdaptiveStream - Adaptive Video Streaming System
echo ================================================
echo  AdaptiveStream - Computer Networks Project
echo ================================================
echo.

rem Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

rem Check Node.js  
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Setting up Python virtual environment...
cd backend
if not exist venv (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo [2/4] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
echo Python dependencies installed.

echo [3/4] Starting backend server...
start "AdaptiveStream Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000 --host 0.0.0.0"
timeout /t 3 /nobreak >nul

echo [4/4] Setting up and starting frontend...
cd ..\ 
cd frontend
if not exist node_modules (
    echo Installing npm packages (this may take a minute)...
    npm install
) else (
    echo node_modules already present.
)
start "AdaptiveStream Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ================================================
echo  AdaptiveStream is starting!
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:5173
echo  API Docs: http://localhost:8000/docs
echo ================================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the application.
pause
