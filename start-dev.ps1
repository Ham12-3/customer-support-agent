# Customer Support Agent - Development Startup Script
# This script starts all services for local development

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Customer Support Agent Platform" -ForegroundColor Cyan
Write-Host " Development Environment Startup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Start databases
Write-Host "Starting databases (PostgreSQL + Redis)..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start databases!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Databases started" -ForegroundColor Green
Write-Host ""

# Wait for databases to be ready
Write-Host "Waiting for databases to be ready (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check database health
$postgresHealth = docker inspect --format='{{.State.Health.Status}}' customersupport-postgres 2>&1
$redisHealth = docker inspect --format='{{.State.Health.Status}}' customersupport-redis 2>&1

if ($postgresHealth -eq "healthy" -and $redisHealth -eq "healthy") {
    Write-Host "✓ Databases are healthy" -ForegroundColor Green
} else {
    Write-Host "⚠ Databases may not be ready yet. Check with: docker-compose ps" -ForegroundColor Yellow
}
Write-Host ""

# Check if migration exists
$migrationExists = Test-Path "backend\src\CustomerSupport.Infrastructure\Data\Migrations"

if (-not $migrationExists) {
    Write-Host "⚠ No database migration found!" -ForegroundColor Yellow
    Write-Host "You need to create and apply the initial migration:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api" -ForegroundColor Cyan
    Write-Host "  dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api" -ForegroundColor Cyan
    Write-Host ""
    $response = Read-Host "Do you want to continue anyway? (y/n)"
    if ($response -ne "y") {
        exit 0
    }
}

# Start backend in new window
Write-Host "Starting backend API..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend\src\CustomerSupport.Api"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting .NET API...' -ForegroundColor Cyan; dotnet watch run"
Write-Host "✓ Backend starting in new window" -ForegroundColor Green
Write-Host ""

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if frontend dependencies are installed
$nodeModulesExists = Test-Path "frontend\node_modules"

if (-not $nodeModulesExists) {
    Write-Host "⚠ Frontend dependencies not installed!" -ForegroundColor Yellow
    Write-Host "Installing with pnpm..." -ForegroundColor Yellow
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Push-Location $frontendPath
    pnpm install
    Pop-Location
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Check if .env.local exists
$envExists = Test-Path "frontend\apps\dashboard\.env.local"

if (-not $envExists) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    $envContent = "NEXT_PUBLIC_API_URL=http://localhost:5000"
    $envPath = Join-Path $PSScriptRoot "frontend\apps\dashboard\.env.local"
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✓ .env.local created" -ForegroundColor Green
    Write-Host ""
}

# Start frontend in new window
Write-Host "Starting frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Next.js...' -ForegroundColor Cyan; pnpm dev"
Write-Host "✓ Frontend starting in new window" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "=====================================" -ForegroundColor Green
Write-Host " 🎉 Application Started!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  Postgres:  localhost:5432" -ForegroundColor White
Write-Host "  Redis:     localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "Two new PowerShell windows opened:" -ForegroundColor Yellow
Write-Host "  1. Backend API (.NET)" -ForegroundColor White
Write-Host "  2. Frontend (Next.js)" -ForegroundColor White
Write-Host ""
Write-Host "To stop:" -ForegroundColor Yellow
Write-Host "  1. Close backend and frontend terminal windows" -ForegroundColor White
Write-Host "  2. Run: docker-compose stop" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
pause


