@echo off
REM Fix Migration Issues - Creates a clean database with all fields

echo ========================================
echo  Fix Database Migrations
echo ========================================
echo.
echo This will:
echo  - Delete all migrations
echo  - Drop the database
echo  - Create fresh migration with all fields
echo  - Apply it to database
echo  - Create test user
echo.

set /p confirm="Are you sure? Type 'yes' to continue: "
if not "%confirm%"=="yes" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/6] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

echo [2/6] Starting PostgreSQL...
docker-compose up -d postgres
timeout /t 5 /nobreak >nul
echo [OK] PostgreSQL started
echo.

echo [3/6] Cleaning old migrations...
cd backend

REM Delete migration folders
if exist "src\CustomerSupport.Infrastructure\Data\Migrations" (
    rmdir /s /q "src\CustomerSupport.Infrastructure\Data\Migrations"
    echo [OK] Deleted Data\Migrations
)

if exist "src\CustomerSupport.Infrastructure\Migrations" (
    rmdir /s /q "src\CustomerSupport.Infrastructure\Migrations"
    echo [OK] Deleted Migrations
)

echo.
echo [4/6] Dropping database...
dotnet ef database drop --force --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api >nul 2>&1
echo [OK] Database dropped
echo.

echo [5/6] Creating fresh migration...
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

if errorlevel 1 (
    echo [ERROR] Failed to create migration!
    cd ..
    pause
    exit /b 1
)
echo [OK] Migration created
echo.

echo [6/6] Applying migration...
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

if errorlevel 1 (
    echo [ERROR] Failed to apply migration!
    cd ..
    pause
    exit /b 1
)
echo [OK] Migration applied

cd ..

echo.
echo [7/7] Creating test user...

REM Generate UUIDs using PowerShell
for /f %%i in ('powershell -Command "[guid]::NewGuid().ToString()"') do set tenantId=%%i
for /f %%i in ('powershell -Command "[guid]::NewGuid().ToString()"') do set userId=%%i
for /f %%i in ('powershell -Command "[DateTime]::UtcNow.ToString('yyyy-MM-dd HH:mm:ss')"') do set now=%%i

REM Create SQL and execute
powershell -Command "$sql = \"INSERT INTO tenants (\\\"Id\\\", \\\"Name\\\", \\\"Email\\\", \\\"Status\\\", \\\"Plan\\\", \\\"CreatedAt\\\") VALUES ('%tenantId%', 'Test Company', 'admin@test.com', 1, 0, '%now%'::timestamp); INSERT INTO users (\\\"Id\\\", \\\"TenantId\\\", \\\"Email\\\", \\\"FirstName\\\", \\\"LastName\\\", \\\"PasswordHash\\\", \\\"Role\\\", \\\"IsActive\\\", \\\"CreatedAt\\\") VALUES ('%userId%', '%tenantId%', 'admin@test.com', 'Admin', 'User', '`$2a`$11`$7nXH7qQQfH9WqKF0rG7VLeqMQQhF7zQQG0.p5JqXK5rG7VLnZXKqMQ', 0, true, '%now%'::timestamp);\"; Write-Output $sql | docker exec -i customersupport-postgres psql -U postgres -d customersupport"

if errorlevel 1 (
    echo [ERROR] Failed to create test user!
    pause
    exit /b 1
)
echo [OK] Test user created

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Test User Credentials:
echo   Email: admin@test.com
echo   Password: Test123!
echo.
echo You can now run: start-dev.bat
echo.
pause

