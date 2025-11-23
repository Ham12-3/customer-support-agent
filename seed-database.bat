@echo off
REM Seed the database with test users
REM This creates:
REM   - admin@testcompany.com / Admin123!
REM   - test@testcompany.com / Test123!

echo =====================================
echo  Database Seeding
echo =====================================
echo.

cd backend\src\CustomerSupport.Api

echo Seeding database with test users...
dotnet run --seed-db

if errorlevel 1 (
    echo [ERROR] Failed to seed database!
    cd ..\..\..
    pause
    exit /b 1
)

cd ..\..\..

echo.
echo =====================================
echo  Seeding Complete!
echo =====================================
echo.
echo Test credentials:
echo   Admin: admin@testcompany.com / Admin123!
echo   User:  test@testcompany.com / Test123!
echo.
pause
