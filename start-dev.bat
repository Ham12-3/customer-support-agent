@echo off
REM Customer Support Agent - Development Startup Script (Command Prompt)
REM This script starts all services for local development

echo =====================================
echo  Customer Support Agent Platform
echo  Development Environment Startup
echo =====================================
echo.

REM Check if Docker is running
echo [1/6] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

REM Start databases
echo [2/6] Starting databases (PostgreSQL + Redis)...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start databases!
    pause
    exit /b 1
)
echo [OK] Databases started
echo.

REM Wait for databases to be ready
echo [3/6] Waiting for databases to initialize (10 seconds)...
timeout /t 10 /nobreak >nul
echo [OK] Databases should be ready
echo.

REM Check if migration exists
echo [4/6] Checking database migration...
if not exist "backend\src\CustomerSupport.Infrastructure\Data\Migrations" (
    echo [WARNING] No database migration found!
    echo.
    echo You need to create the initial migration first.
    echo Run these commands in a separate window:
    echo.
    echo   cd backend
    echo   dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
    echo   dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
    echo.
    choice /C YN /M "Do you want to continue anyway"
    if errorlevel 2 exit /b 0
) else (
    echo [OK] Migration folder exists
)
echo.

REM Check if frontend dependencies are installed
echo [5/6] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call pnpm install
    cd ..
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Check if .env.local exists
if not exist "frontend\apps\dashboard\.env.local" (
    echo [INFO] Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000 > frontend\apps\dashboard\.env.local
    echo [OK] .env.local created
)

REM Start backend in new window
echo [6/6] Starting backend and frontend...
start "Backend API (.NET)" cmd /k "cd /d "%~dp0backend\src\CustomerSupport.Api" && echo Starting .NET API... && dotnet watch run"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && echo Starting Next.js... && pnpm dev"

echo.
echo =====================================
echo  Application Started Successfully!
echo =====================================
echo.
echo Services:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000/swagger
echo   Postgres:  localhost:5432
echo   Redis:     localhost:6379
echo.
echo Two new windows opened:
echo   1. Backend API (.NET)
echo   2. Frontend (Next.js)
echo.
echo To stop:
echo   1. Close the backend and frontend windows
echo   2. Run: docker-compose stop
echo.
echo Press any key to close this window...
pause >nul


