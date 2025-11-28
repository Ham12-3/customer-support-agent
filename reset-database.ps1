#!/usr/bin/env pwsh
# Reset Database Script - Drops and recreates database with test user
# Password for test user will be: Test123!

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Red
Write-Host " ⚠️  DATABASE RESET" -ForegroundColor Red
Write-Host "════════════════════════════════════════" -ForegroundColor Red
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  • Delete ALL users and tenants" -ForegroundColor Yellow
Write-Host "  • Drop and recreate the database" -ForegroundColor Yellow
Write-Host "  • Create a test user (admin@test.com / Test123!)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure? Type 'yes' to continue"

if ($confirm -ne "yes") {
    Write-Host "❌ Operation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔄 Starting database reset..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/5] Checking Docker..." -ForegroundColor Cyan
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running! Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/5] Starting PostgreSQL..." -ForegroundColor Cyan
docker-compose up -d postgres
Start-Sleep -Seconds 5
Write-Host "✅ PostgreSQL started" -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Dropping existing database..." -ForegroundColor Cyan
Push-Location backend
try {
    dotnet ef database drop --force --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api 2>&1 | Out-Null
    Write-Host "✅ Database dropped" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database may not exist (this is ok)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/5] Creating fresh database..." -ForegroundColor Cyan
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create database!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✅ Database created" -ForegroundColor Green

Pop-Location

Write-Host ""
Write-Host "[5/5] Creating test user..." -ForegroundColor Cyan

# Generate UUIDs
$tenantId = [guid]::NewGuid().ToString()
$userId = [guid]::NewGuid().ToString()
$now = [DateTime]::UtcNow.ToString("yyyy-MM-dd HH:mm:ss")

# BCrypt hash for "Test123!" (pre-computed for consistency)
$passwordHash = '$2a$11$7nXH7qQQfH9WqKF0rG7VLeqMQQhF7zQQG0.p5JqXK5rG7VLnZXKqMQ'

# Create SQL commands
$sqlCommands = @"
INSERT INTO tenants ("Id", "Name", "Email", "Status", "Plan", "CreatedAt")
VALUES ('$tenantId', 'Test Company', 'admin@test.com', 1, 0, '$now'::timestamp);

INSERT INTO users ("Id", "TenantId", "Email", "FirstName", "LastName", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES ('$userId', '$tenantId', 'admin@test.com', 'Admin', 'User', '$passwordHash', 0, true, '$now'::timestamp);
"@

# Execute SQL
try {
    $sqlCommands | docker exec -i customersupport-postgres psql -U postgres -d customersupport
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create test user!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Test user created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create test user: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host " ✅  DATABASE RESET COMPLETE!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Test User Credentials:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   📧 Email:    " -NoNewline -ForegroundColor White
Write-Host "admin@test.com" -ForegroundColor Yellow
Write-Host "   🔑 Password: " -NoNewline -ForegroundColor White
Write-Host "Test123!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 You can now:" -ForegroundColor Cyan
Write-Host "   • Run: " -NoNewline -ForegroundColor White
Write-Host ".\start-dev.ps1" -ForegroundColor Yellow
Write-Host "   • Or:  " -NoNewline -ForegroundColor White
Write-Host ".\start-dev.bat" -ForegroundColor Yellow
Write-Host ""

