# Setup .NET User Secrets for API Keys
# This is the recommended way to manage secrets in .NET development

Write-Host "`n=== Setting Up .NET User Secrets ===" -ForegroundColor Cyan
Write-Host ""

$projectPath = "backend/src/CustomerSupport.Api"

Write-Host "Step 1: Initializing User Secrets..." -ForegroundColor Yellow
cd $projectPath
dotnet user-secrets init

Write-Host "`nStep 2: Setting Gemini API Key..." -ForegroundColor Yellow
$geminiKey = Read-Host "Enter your Gemini API Key (or press Enter to use existing from appsettings.json)"

if ([string]::IsNullOrWhiteSpace($geminiKey)) {
    # Read from appsettings.json
    $appsettings = Get-Content "appsettings.json" | ConvertFrom-Json
    $geminiKey = $appsettings.Gemini.ApiKey
    Write-Host "Using existing key from appsettings.json: $($geminiKey.Substring(0,10))..." -ForegroundColor Gray
}

dotnet user-secrets set "Gemini:ApiKey" $geminiKey

Write-Host "`nStep 3: Setting JWT Secret..." -ForegroundColor Yellow
$jwtSecret = Read-Host "Enter JWT Secret (or press Enter to generate a random one)"

if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    # Generate a random JWT secret
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    Write-Host "Generated random JWT Secret" -ForegroundColor Gray
}

dotnet user-secrets set "JWT:Secret" $jwtSecret

Write-Host "`nStep 4: Setting Database Password..." -ForegroundColor Yellow
$dbPassword = Read-Host "Enter PostgreSQL Password (default: postgres)"

if ([string]::IsNullOrWhiteSpace($dbPassword)) {
    $dbPassword = "postgres"
}

$connectionString = "Host=127.0.0.1;Database=customersupport;Username=postgres;Password=$dbPassword;Port=5432;SSL Mode=Disable;Timeout=30;"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" $connectionString

Write-Host "`n=== User Secrets Configured Successfully! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Your secrets are stored securely at:" -ForegroundColor Cyan
Write-Host "Windows: %APPDATA%\Microsoft\UserSecrets\" -ForegroundColor White
Write-Host "Mac/Linux: ~/.microsoft/usersecrets/" -ForegroundColor White
Write-Host ""
Write-Host "To view your secrets:" -ForegroundColor Yellow
Write-Host "  dotnet user-secrets list" -ForegroundColor White
Write-Host ""
Write-Host "To remove a secret:" -ForegroundColor Yellow
Write-Host "  dotnet user-secrets remove 'Gemini:ApiKey'" -ForegroundColor White
Write-Host ""

cd ../../../

