# Git Safety Verification Script
# Run this before pushing to GitHub

Write-Host "`n🔒 Git Safety Verification" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

$issues = @()
$warnings = @()

# Check 1: appsettings.json
Write-Host "Checking appsettings.json..." -ForegroundColor Yellow
$appsettings = git ls-files | Select-String "appsettings.json"
if ($appsettings) {
    $issues += "❌ appsettings.json is tracked in git!"
    Write-Host "❌ ERROR: appsettings.json is tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ appsettings.json is NOT tracked" -ForegroundColor Green
}

# Check 2: appsettings.Development.json
Write-Host "Checking appsettings.Development.json..." -ForegroundColor Yellow
$appsettingsDev = git ls-files | Select-String "appsettings.Development.json"
if ($appsettingsDev) {
    $issues += "❌ appsettings.Development.json is tracked in git!"
    Write-Host "❌ ERROR: appsettings.Development.json is tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ appsettings.Development.json is NOT tracked" -ForegroundColor Green
}

# Check 3: .env files
Write-Host "Checking .env files..." -ForegroundColor Yellow
$envFiles = git ls-files | Select-String "\.env"
if ($envFiles) {
    $envFilesList = $envFiles -join ", "
    $warnings += "⚠️ .env files found: $envFilesList"
    Write-Host "⚠️ WARNING: .env files are tracked: $envFilesList" -ForegroundColor Yellow
} else {
    Write-Host "✅ No .env files tracked" -ForegroundColor Green
}

# Check 4: node_modules
Write-Host "Checking node_modules..." -ForegroundColor Yellow
$nodeModules = git ls-files | Select-String "node_modules"
if ($nodeModules) {
    $issues += "❌ node_modules is tracked in git!"
    Write-Host "❌ ERROR: node_modules is tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ node_modules is NOT tracked" -ForegroundColor Green
}

# Check 5: bin/obj folders
Write-Host "Checking bin/obj folders..." -ForegroundColor Yellow
$buildArtifacts = git ls-files | Select-String "\\bin\\|\\obj\\"
if ($buildArtifacts) {
    $warnings += "⚠️ Build artifacts (bin/obj) are tracked"
    Write-Host "⚠️ WARNING: Build artifacts found in git" -ForegroundColor Yellow
} else {
    Write-Host "✅ Build artifacts are NOT tracked" -ForegroundColor Green
}

# Check 6: .next folder
Write-Host "Checking .next folder..." -ForegroundColor Yellow
$nextBuild = git ls-files | Select-String "\\.next\\"
if ($nextBuild) {
    $warnings += "⚠️ .next build folder is tracked"
    Write-Host "⚠️ WARNING: .next folder is tracked" -ForegroundColor Yellow
} else {
    Write-Host "✅ .next folder is NOT tracked" -ForegroundColor Green
}

# Check 7: Log files
Write-Host "Checking log files..." -ForegroundColor Yellow
$logFiles = git ls-files | Select-String "\.log$|log-.*\.txt$"
if ($logFiles) {
    $warnings += "⚠️ Log files are tracked"
    Write-Host "⚠️ WARNING: Log files found in git" -ForegroundColor Yellow
} else {
    Write-Host "✅ Log files are NOT tracked" -ForegroundColor Green
}

# Check 8: Certificate/Key files
Write-Host "Checking certificate/key files..." -ForegroundColor Yellow
$certs = git ls-files | Select-String "\.(key|pem|p12|pfx)$"
if ($certs) {
    $issues += "❌ Certificate/key files are tracked!"
    Write-Host "❌ ERROR: Certificate/key files are tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ No certificate/key files tracked" -ForegroundColor Green
}

# Check 9: Verify appsettings.Example.json exists
Write-Host "Checking appsettings.Example.json..." -ForegroundColor Yellow
if (Test-Path "backend\src\CustomerSupport.Api\appsettings.Example.json") {
    Write-Host "✅ appsettings.Example.json exists (good for reference)" -ForegroundColor Green
} else {
    $warnings += "⚠️ appsettings.Example.json not found"
    Write-Host "⚠️ WARNING: appsettings.Example.json not found" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "Your repository is safe to push to GitHub." -ForegroundColor Green
    exit 0
} elseif ($issues.Count -gt 0) {
    Write-Host "`n❌ CRITICAL ISSUES FOUND:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  $issue" -ForegroundColor Red
    }
    Write-Host "`n⚠️ Please fix these issues before pushing!" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n⚠️ WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  $warning" -ForegroundColor Yellow
    }
    Write-Host "`n✅ No critical issues, but review warnings above." -ForegroundColor Green
    exit 0
}

