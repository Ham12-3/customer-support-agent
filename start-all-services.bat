@echo off
echo ========================================
echo Starting Customer Support Agent System
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/5] Starting Docker services (PostgreSQL + Redis)...
docker-compose up -d
timeout /t 3 /nobreak >nul

echo.
echo [2/5] Starting Backend API (Port 5000)...
start "Backend API" cmd /k "cd backend\src\CustomerSupport.Api && dotnet run"
timeout /t 5 /nobreak >nul

echo.
echo [3/5] Starting Dashboard Frontend (Port 3000)...
start "Dashboard" cmd /k "cd frontend\apps\dashboard && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [4/5] Starting Chat Widget (Port 3001)...
start "Chat Widget" cmd /k "cd frontend\apps\widget && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [5/5] All services starting...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo ✅ All Services Started Successfully!
echo ========================================
echo.
echo 🌐 Backend API:     http://localhost:5000
echo 📊 Dashboard:       http://localhost:3000
echo 💬 Chat Widget:     http://localhost:3001
echo.
echo 📚 PostgreSQL:      localhost:5432
echo 🔴 Redis:           localhost:6379
echo.
echo Press Ctrl+C in each window to stop services
echo ========================================
pause

