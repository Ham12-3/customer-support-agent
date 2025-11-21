@echo off
REM Customer Support Agent - Database Setup Script
REM Run this ONCE to create the initial database migration

echo =====================================
echo  Database Setup
echo =====================================
echo.

echo [1/3] Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

echo [2/3] Starting databases if not running...
docker-compose up -d
timeout /t 5 /nobreak >nul
echo [OK] Databases are running
echo.

echo [3/3] Creating and applying database migration...
cd backend

echo.
echo Creating migration...
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

if errorlevel 1 (
    echo [ERROR] Failed to create migration!
    cd ..
    pause
    exit /b 1
)
echo [OK] Migration created
echo.

echo Applying migration to database...
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

if errorlevel 1 (
    echo [ERROR] Failed to apply migration!
    cd ..
    pause
    exit /b 1
)
echo [OK] Database migration applied successfully!

cd ..

echo.
echo =====================================
echo  Database Setup Complete!
echo =====================================
echo.
echo You can now run: start-dev.bat
echo.
pause


