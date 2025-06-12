@echo off
REM 🥔 Potato Disease Classification System Setup Script for Windows
REM Requires Python 3.8+ and Node.js 14+ to be installed

echo 🥔 Potato Disease Classification System Setup
echo =============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ first from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 14+ first from https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Python version: 
python --version

echo [INFO] Node.js version: 
node --version

echo [INFO] npm version: 
npm --version
echo.

REM Setup Python backend
echo [INFO] Setting up Python backend...

if not exist "myenv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv myenv
    echo [SUCCESS] Virtual environment created!
) else (
    echo [WARNING] Virtual environment already exists
)

echo [INFO] Installing Python dependencies...
myenv\Scripts\pip install --upgrade pip
myenv\Scripts\pip install -r requirements.txt

echo [SUCCESS] Python backend setup complete!
echo.

REM Setup React frontend
echo [INFO] Setting up React frontend...
cd frontend

if not exist "node_modules" (
    echo [INFO] Installing Node.js dependencies...
    npm install
    echo [SUCCESS] Frontend dependencies installed!
) else (
    echo [WARNING] Node.js dependencies already installed
)

cd ..

echo [SUCCESS] React frontend setup complete!
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the application, open TWO command prompts:
echo.
echo Terminal 1 (Backend):
echo   cd api
echo   ..\myenv\Scripts\activate
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm start
echo.
echo Access Points:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo   API Documentation: http://localhost:8000/docs
echo.
echo Happy disease detection! 🥔🔬
pause
