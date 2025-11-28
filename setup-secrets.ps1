# Setup Script: Create appsettings.json from Example
# Run this when setting up the project for the first time

Write-Host "🔐 Setting Up Secrets Configuration" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

$appsettingsPath = "backend\src\CustomerSupport.Api\appsettings.json"
$examplePath = "backend\src\CustomerSupport.Api\appsettings.Example.json"

# Check if example file exists
if (-not (Test-Path $examplePath)) {
    Write-Host "❌ ERROR: appsettings.Example.json not found!" -ForegroundColor Red
    Write-Host "Expected location: $examplePath" -ForegroundColor Yellow
    exit 1
}

# Check if appsettings.json already exists
if (Test-Path $appsettingsPath) {
    Write-Host "⚠️  appsettings.json already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    
    if ($overwrite -ne "yes") {
        Write-Host "Keeping existing file. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

# Copy example to appsettings.json
Write-Host "📋 Copying appsettings.Example.json to appsettings.json..." -ForegroundColor Yellow
Copy-Item $examplePath $appsettingsPath -Force
Write-Host "✓ File created" -ForegroundColor Green
Write-Host ""

# Verify it's in .gitignore
Write-Host "🔍 Verifying appsettings.json is in .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "appsettings\.json") {
    Write-Host "✓ appsettings.json is in .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: appsettings.json may not be in .gitignore!" -ForegroundColor Yellow
    Write-Host "Please check your .gitignore file." -ForegroundColor Yellow
}
Write-Host ""

# Check if it's tracked by git
Write-Host "🔍 Checking if appsettings.json is tracked by git..." -ForegroundColor Yellow
$tracked = git ls-files | Select-String "appsettings.json"
if ($tracked) {
    Write-Host "❌ ERROR: appsettings.json is tracked in git!" -ForegroundColor Red
    Write-Host "Run: git rm --cached $appsettingsPath" -ForegroundColor Yellow
} else {
    Write-Host "✓ appsettings.json is NOT tracked (good!)" -ForegroundColor Green
}
Write-Host ""

# Instructions
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open: $appsettingsPath" -ForegroundColor White
Write-Host "2. Replace all placeholders with your real secrets:" -ForegroundColor White
Write-Host "   - YOUR_PASSWORD_HERE → Your database password" -ForegroundColor Gray
Write-Host "   - YOUR_GEMINI_API_KEY_HERE → Your Gemini API key" -ForegroundColor Gray
Write-Host "   - GENERATE_A_STRONG_SECRET_KEY... → A strong random string" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Save the file" -ForegroundColor White
Write-Host "4. NEVER commit this file to git!" -ForegroundColor Red
Write-Host ""

