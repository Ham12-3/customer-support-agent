# Generate and Store Strong JWT Secret
# Run this from the project root directory

Write-Host "`n=== Generating Strong JWT Secret ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to API project
Set-Location "backend/src/CustomerSupport.Api"

# Generate cryptographically secure secret
$bytes = New-Object byte[] 64
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "Generated JWT Secret:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host ""

# Store in User Secrets
Write-Host "Storing in User Secrets..." -ForegroundColor Cyan
dotnet user-secrets set "JWT:Secret" $secret

Write-Host ""
Write-Host "✅ JWT Secret stored successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update appsettings.json to use 'SET_VIA_USER_SECRETS' as placeholder" -ForegroundColor White
Write-Host "2. Verify with: dotnet user-secrets list" -ForegroundColor White
Write-Host ""

# Return to root
Set-Location "../../.."

