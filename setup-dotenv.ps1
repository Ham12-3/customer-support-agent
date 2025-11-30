# Setup .env file for .NET Backend
# This script helps you create a .env file with your API keys

Write-Host "`n=== Setting Up .env File for Backend ===" -ForegroundColor Cyan
Write-Host ""

$envPath = "backend\.env"
$envExamplePath = "backend\.env.example"

# Check if .env already exists
if (Test-Path $envPath) {
    $overwrite = Read-Host ".env file already exists. Overwrite? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Cancelled. Existing .env file preserved." -ForegroundColor Yellow
        exit 0
    }
}

# Read from appsettings.json to get current values
$appsettingsPath = "backend\src\CustomerSupport.Api\appsettings.json"
if (Test-Path $appsettingsPath) {
    $appsettings = Get-Content $appsettingsPath | ConvertFrom-Json
    
    Write-Host "Found existing appsettings.json, using values as defaults..." -ForegroundColor Gray
    
    $geminiKey = $appsettings.Gemini.ApiKey
    $jwtSecret = $appsettings.JWT.Secret
    
    # Extract DB password from connection string
    if ($appsettings.ConnectionStrings.DefaultConnection -match "Password=([^;]+)") {
        $dbPassword = $matches[1]
    } else {
        $dbPassword = "postgres"
    }
} else {
    $geminiKey = ""
    $jwtSecret = ""
    $dbPassword = "postgres"
}

Write-Host ""
Write-Host "Creating .env file with your secrets..." -ForegroundColor Yellow
Write-Host ""

# Create .env content
$envContent = @"
# .NET Backend Environment Variables
# Auto-generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Gemini AI Configuration
GEMINI_API_KEY=$geminiKey
GEMINI_MODEL=gemini-3-flash

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=customersupport
DB_USER=postgres
DB_PASSWORD=$dbPassword

# Redis Configuration
REDIS_CONNECTION=localhost:6379

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_ISSUER=CustomerSupportAgent
JWT_AUDIENCE=CustomerSupportAPI
JWT_EXPIRATION_MINUTES=60

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# API Configuration
API_BASE_URL=http://localhost:5000

# Widget Configuration
WIDGET_URL=http://localhost:3001

# Environment
ASPNETCORE_ENVIRONMENT=Development
"@

# Write to .env file
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $envPath" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure .env is in your .gitignore!" -ForegroundColor Yellow

# Check if .env is in .gitignore
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    if ($gitignoreContent -notmatch "\.env") {
        Write-Host ""
        $addToGitignore = Read-Host "Add .env to .gitignore? (Y/n)"
        if ($addToGitignore -ne "n" -and $addToGitignore -ne "N") {
            Add-Content -Path $gitignorePath -Value "`n# Environment variables`n.env`nbackend/.env"
            Write-Host "✅ Added .env to .gitignore" -ForegroundColor Green
        }
    } else {
        Write-Host "✅ .env is already in .gitignore" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Install DotNetEnv package:" -ForegroundColor White
Write-Host "   cd backend/src/CustomerSupport.Api" -ForegroundColor Gray
Write-Host "   dotnet add package DotNetEnv" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Load .env in Program.cs (see instructions below)" -ForegroundColor White
Write-Host ""

