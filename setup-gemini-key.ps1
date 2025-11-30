# Store Gemini API Key in User Secrets
# Run this from the project root directory

Write-Host "`n=== Storing Gemini API Key ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to API project
Set-Location "backend/src/CustomerSupport.Api"

# Prompt for API key
Write-Host "IMPORTANT: Before continuing, please:" -ForegroundColor Yellow
Write-Host "1. Go to: https://makersuite.google.com/app/apikey" -ForegroundColor White
Write-Host "2. REVOKE your old API key (it's compromised)" -ForegroundColor Red
Write-Host "3. Generate a NEW API key" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Enter your NEW Gemini API Key (or press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "Skipped. You can set it later with:" -ForegroundColor Yellow
    Write-Host "  dotnet user-secrets set 'Gemini:ApiKey' 'YOUR_KEY'" -ForegroundColor Gray
} else {
    Write-Host "Storing API key in User Secrets..." -ForegroundColor Cyan
    dotnet user-secrets set "Gemini:ApiKey" $apiKey
    Write-Host "✅ Gemini API Key stored successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "View all secrets with: dotnet user-secrets list" -ForegroundColor Cyan
Write-Host ""

# Return to root
Set-Location "../../.."

