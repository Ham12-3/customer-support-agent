# Seed the database with test users
# This creates:
#   - admin@testcompany.com / Admin123!
#   - test@testcompany.com / Test123!

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Database Seeding" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend/src/CustomerSupport.Api

Write-Host "Seeding database with test users..." -ForegroundColor Yellow
dotnet run --seed-db

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to seed database!" -ForegroundColor Red
    Set-Location ../../..
    exit 1
}

Set-Location ../../..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host " Seeding Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor Cyan
Write-Host "  Admin: admin@testcompany.com / Admin123!" -ForegroundColor White
Write-Host "  User:  test@testcompany.com / Test123!" -ForegroundColor White
Write-Host ""
