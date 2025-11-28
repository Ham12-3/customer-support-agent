@echo off
REM Reset Database - Clears all data and creates fresh database with test user
REM Use this when you forget your password or need a clean start

echo ========================================
echo  Reset Database
echo ========================================
echo.

echo [WARNING] This will:
echo  - Delete ALL users and tenants
echo  - Reset the database to fresh state  
echo  - Create a test user (admin@test.com / Test123!)
echo.

set /p confirm="Are you sure? Type 'yes' to continue: "
if not "%confirm%"=="yes" (
    echo.
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/4] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

echo [2/4] Starting PostgreSQL...
docker-compose up -d postgres
timeout /t 5 /nobreak >nul
echo [OK] PostgreSQL started
echo.

echo [3/4] Resetting database...
cd backend

REM Drop database
echo Dropping existing database...
dotnet ef database drop --force --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api >nul 2>&1

REM Create fresh database
echo Creating fresh database...
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

if errorlevel 1 (
    echo [ERROR] Failed to create database!
    cd ..
    pause
    exit /b 1
)
echo [OK] Database created
cd ..

echo.
echo [4/4] Creating test user...

REM Use PowerShell to create test user via SQL
powershell -Command "$tenantId = [guid]::NewGuid().ToString(); $userId = [guid]::NewGuid().ToString(); $now = [DateTime]::UtcNow.ToString('yyyy-MM-dd HH:mm:ss'); $sql = \"INSERT INTO tenants (\\\"Id\\\", \\\"Name\\\", \\\"Email\\\", \\\"Status\\\", \\\"Plan\\\", \\\"CreatedAt\\\") VALUES ('$tenantId', 'Test Company', 'admin@test.com', 1, 0, '$now'::timestamp); INSERT INTO users (\\\"Id\\\", \\\"TenantId\\\", \\\"Email\\\", \\\"FirstName\\\", \\\"LastName\\\", \\\"PasswordHash\\\", \\\"Role\\\", \\\"IsActive\\\", \\\"CreatedAt\\\") VALUES ('$userId', '$tenantId', 'admin@test.com', 'Admin', 'User', '`$2a`$11`$7nXH7qQQfH9WqKF0rG7VLeqMQQhF7zQQG0.p5JqXK5rG7VLnZXKqMQ', 0, true, '$now'::timestamp);\"; Write-Output $sql | docker exec -i customersupport-postgres psql -U postgres -d customersupport"

echo [OK] Test user created

echo.
echo ========================================
echo  Database Reset Complete!
echo ========================================
echo.
echo Test User Credentials:
echo   Email: admin@test.com
echo   Password: Test123!
echo.
echo You can now run: start-dev.bat
echo.
pause

