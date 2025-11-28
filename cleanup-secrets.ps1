# Emergency Secret Cleanup Script
# Run this to remove exposed secrets from git history

Write-Host "🚨 EMERGENCY SECRET CLEANUP" -ForegroundColor Red
Write-Host "=" * 50 -ForegroundColor Red
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Please run this script from the repository root." -ForegroundColor Yellow
    exit 1
}

Write-Host "⚠️  WARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "Make sure you've revoked the exposed API key first!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Have you revoked the API key? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Please revoke the API key first, then run this script again." -ForegroundColor Red
    Write-Host "Go to: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove PRE_COMMIT_SECURITY_CHECKLIST.md from history
Write-Host "[1/5] Removing PRE_COMMIT_SECURITY_CHECKLIST.md from git history..." -ForegroundColor Yellow
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch PRE_COMMIT_SECURITY_CHECKLIST.md" --prune-empty --tag-name-filter cat -- --all
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Removed from history" -ForegroundColor Green
} else {
    Write-Host "⚠️  File may not have been in history" -ForegroundColor Yellow
}

# Step 2: Remove appsettings.json from history (if it was committed)
Write-Host "[2/5] Removing appsettings.json from git history..." -ForegroundColor Yellow
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/src/CustomerSupport.Api/appsettings.json" --prune-empty --tag-name-filter cat -- --all
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Removed from history" -ForegroundColor Green
} else {
    Write-Host "⚠️  File may not have been in history" -ForegroundColor Yellow
}

# Step 3: Clean up git
Write-Host "[3/5] Cleaning up git references..." -ForegroundColor Yellow
git reflog expire --expire=now --all
git gc --prune=now --aggressive
Write-Host "✓ Cleanup complete" -ForegroundColor Green

# Step 4: Delete file locally
Write-Host "[4/5] Deleting PRE_COMMIT_SECURITY_CHECKLIST.md locally..." -ForegroundColor Yellow
if (Test-Path "PRE_COMMIT_SECURITY_CHECKLIST.md") {
    Remove-Item "PRE_COMMIT_SECURITY_CHECKLIST.md" -Force
    Write-Host "✓ File deleted" -ForegroundColor Green
} else {
    Write-Host "⚠️  File not found locally" -ForegroundColor Yellow
}

# Step 5: Verify
Write-Host "[5/5] Verifying cleanup..." -ForegroundColor Yellow
$tracked = git ls-files | Select-String "PRE_COMMIT_SECURITY_CHECKLIST"
if ($tracked) {
    Write-Host "❌ ERROR: File is still tracked!" -ForegroundColor Red
    Write-Host "Run: git rm --cached PRE_COMMIT_SECURITY_CHECKLIST.md" -ForegroundColor Yellow
} else {
    Write-Host "✓ File is not tracked" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update your local appsettings.json with new API key" -ForegroundColor White
Write-Host "2. Review: git log --all --source --full-history -p | findstr AIzaSy" -ForegroundColor White
Write-Host "3. If repository is PRIVATE and you're the only contributor:" -ForegroundColor White
Write-Host "   git push origin --force --all" -ForegroundColor Cyan
Write-Host "4. If repository is PUBLIC:" -ForegroundColor White
Write-Host "   DO NOT force push. Secrets are compromised." -ForegroundColor Red
Write-Host "   Revoke all exposed secrets and create new commits." -ForegroundColor Red
Write-Host ""

