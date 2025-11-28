# Verification Script: Check if secrets are properly configured

Write-Host "🔍 Verifying Secret Configuration" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Check 1: Is appsettings.json in .gitignore?
Write-Host "[1/6] Checking .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw -ErrorAction SilentlyContinue
if ($gitignoreContent -match "appsettings\.json") {
    Write-Host "  ✓ appsettings.json is in .gitignore" -ForegroundColor Green
} else {
    Write-Host "  ❌ appsettings.json is NOT in .gitignore!" -ForegroundColor Red
    $errors++
}

# Check 2: Is appsettings.json tracked by git?
Write-Host "[2/6] Checking if appsettings.json is tracked..." -ForegroundColor Yellow
$tracked = git ls-files 2>$null | Select-String "appsettings\.json"
if ($tracked) {
    Write-Host "  ❌ ERROR: appsettings.json is tracked in git!" -ForegroundColor Red
    Write-Host "    Run: git rm --cached backend/src/CustomerSupport.Api/appsettings.json" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "  ✓ appsettings.json is NOT tracked (good!)" -ForegroundColor Green
}

# Check 3: Does appsettings.Example.json exist?
Write-Host "[3/6] Checking for appsettings.Example.json..." -ForegroundColor Yellow
$examplePath = "backend\src\CustomerSupport.Api\appsettings.Example.json"
if (Test-Path $examplePath) {
    Write-Host "  ✓ appsettings.Example.json exists" -ForegroundColor Green
    
    # Check if it has placeholders
    $exampleContent = Get-Content $examplePath -Raw
    if ($exampleContent -match "YOUR_.*_HERE|GENERATE_.*") {
        Write-Host "  ✓ Contains placeholders (good!)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  WARNING: May contain real secrets!" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "  ⚠️  WARNING: appsettings.Example.json not found" -ForegroundColor Yellow
    $warnings++
}

# Check 4: Does appsettings.json exist locally?
Write-Host "[4/6] Checking for local appsettings.json..." -ForegroundColor Yellow
$appsettingsPath = "backend\src\CustomerSupport.Api\appsettings.json"
if (Test-Path $appsettingsPath) {
    Write-Host "  ✓ appsettings.json exists locally" -ForegroundColor Green
    
    # Check if it has real values (not placeholders)
    $appsettingsContent = Get-Content $appsettingsPath -Raw
    if ($appsettingsContent -match "YOUR_.*_HERE|GENERATE_.*") {
        Write-Host "  ⚠️  WARNING: Still contains placeholders!" -ForegroundColor Yellow
        Write-Host "    You need to replace them with real values." -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "  ✓ Contains real values (configured)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  WARNING: appsettings.json not found locally" -ForegroundColor Yellow
    Write-Host "    Run: .\setup-secrets.ps1" -ForegroundColor Yellow
    $warnings++
}

# Check 5: Is appsettings.json staged for commit?
Write-Host "[5/6] Checking if appsettings.json is staged..." -ForegroundColor Yellow
$staged = git diff --cached --name-only 2>$null | Select-String "appsettings\.json"
if ($staged) {
    Write-Host "  ❌ ERROR: appsettings.json is staged for commit!" -ForegroundColor Red
    Write-Host "    Run: git reset HEAD backend/src/CustomerSupport.Api/appsettings.json" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "  ✓ appsettings.json is NOT staged (good!)" -ForegroundColor Green
}

# Check 6: Check for secrets in git history
Write-Host "[6/6] Checking git history for exposed secrets..." -ForegroundColor Yellow
$historyCheck = git log --all --source --full-history -p 2>$null | Select-String "AIzaSy" | Select-Object -First 1
if ($historyCheck) {
    Write-Host "  ❌ ERROR: Secrets found in git history!" -ForegroundColor Red
    Write-Host "    Run: .\cleanup-secrets.ps1" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "  ✓ No obvious secrets in recent history" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ All checks passed! Your secrets are properly configured." -ForegroundColor Green
    exit 0
} elseif ($errors -gt 0) {
    Write-Host "❌ Found $errors critical error(s)!" -ForegroundColor Red
    Write-Host "Please fix these issues before committing." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "⚠️  Found $warnings warning(s)." -ForegroundColor Yellow
    Write-Host "Review the warnings above." -ForegroundColor Yellow
    exit 0
}

