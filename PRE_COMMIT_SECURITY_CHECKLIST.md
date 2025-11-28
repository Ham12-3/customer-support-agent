# 🔒 Pre-Commit Security Checklist

## ⚠️ CRITICAL: Security Issues Found

### 🚨 **URGENT: Remove API Key from appsettings.json**

The file `backend/src/CustomerSupport.Api/appsettings.json` contains:
- **Gemini API Key**: `[REDACTED - REMOVED FOR SECURITY]` ⚠️ **DO NOT COMMIT**
- JWT Secret (temporary, but should be removed)
- Database connection string with password

**ACTION REQUIRED:** This file should NOT be committed to GitHub!

---

## ✅ Files That Should Be Excluded (Check .gitignore)

### Backend Files
- ✅ `**/appsettings.json` - Contains secrets
- ✅ `**/appsettings.Development.json` - May contain secrets
- ✅ `**/appsettings.*.json` - All environment-specific configs
- ✅ `**/bin/` - Build artifacts
- ✅ `**/obj/` - Build artifacts
- ✅ `**/logs/` - Log files
- ✅ `**/secrets.json` - User secrets

### Frontend Files
- ✅ `**/.env.local` - Environment variables
- ✅ `**/.env.*.local` - Local environment files
- ✅ `node_modules/` - Dependencies
- ✅ `.next/` - Next.js build output
- ✅ `.turbo/` - Turbo cache

### General
- ✅ `*.log` - Log files
- ✅ `*.db` - Database files
- ✅ `*.key`, `*.pem`, `*.p12`, `*.pfx` - Certificates/keys
- ✅ `**/uploads/` - User uploaded files

---

## 🔍 Verification Steps

### Step 1: Verify .gitignore is Working

Run these commands to check if sensitive files are being ignored:

```powershell
# Check if appsettings.json is tracked
git ls-files | findstr appsettings.json

# Check if any .env files are tracked
git ls-files | findstr ".env"

# Check if node_modules is tracked
git ls-files | findstr node_modules

# Check if bin/obj folders are tracked
git ls-files | findstr "bin\|obj"
```

**Expected Result:** No output (all should be ignored)

### Step 2: Check for Hardcoded Secrets in Code

Search for common secret patterns:

```powershell
# Search for API keys
git grep -i "api.*key" -- "*.cs" "*.ts" "*.tsx" "*.json" | findstr /v "Example\|YOUR_"

# Search for passwords
git grep -i "password" -- "*.cs" "*.ts" "*.tsx" | findstr /v "Example\|YOUR_\|//"

# Search for connection strings
git grep -i "connectionstring" -- "*.cs" "*.ts" "*.tsx" | findstr /v "Example\|YOUR_"
```

### Step 3: Verify appsettings.json is NOT in Git History

```powershell
# Check if appsettings.json was ever committed
git log --all --full-history -- "**/appsettings.json"

# If it shows commits, you need to remove it from history (see below)
```

---

## 🛠️ Actions to Take Before Pushing

### Action 1: Ensure appsettings.json is NOT Committed

If `appsettings.json` is already tracked by git:

```powershell
# Remove from git tracking (but keep local file)
git rm --cached backend/src/CustomerSupport.Api/appsettings.json
git rm --cached backend/src/CustomerSupport.Api/appsettings.Development.json

# Commit the removal
git commit -m "Remove sensitive configuration files from git tracking"
```

### Action 2: Verify .gitignore is Correct

The root `.gitignore` should have these patterns:

```gitignore
# Configuration files with secrets
**/appsettings.json
**/appsettings.Development.json
**/appsettings.*.json
!**/appsettings.Example.json

# Environment variables
**/.env
**/.env.*
!**/.env.example

# Build artifacts
bin/
obj/
node_modules/
.next/
```

### Action 3: Check for Other Sensitive Files

Look for these files that might contain secrets:

```powershell
# Check for any .env files
dir /s /b .env* 2>nul

# Check for secrets.json
dir /s /b *secrets.json 2>nul

# Check for certificate files
dir /s /b *.key *.pem *.p12 *.pfx 2>nul
```

### Action 4: Remove Sensitive Data from Git History (if needed)

If `appsettings.json` was previously committed, you need to remove it from history:

```powershell
# WARNING: This rewrites git history. Only do this if the repo hasn't been shared yet!

# Use git filter-branch or BFG Repo-Cleaner
# For BFG (recommended):
# 1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
# 2. java -jar bfg.jar --delete-files appsettings.json
# 3. git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

---

## ✅ Final Checklist Before Push

- [ ] `appsettings.json` is NOT in git tracking
- [ ] `appsettings.json` is in `.gitignore`
- [ ] No `.env` files are tracked
- [ ] No API keys in code files (only in config files that are ignored)
- [ ] No hardcoded passwords
- [ ] `node_modules/` is ignored
- [ ] `bin/` and `obj/` folders are ignored
- [ ] Log files are ignored
- [ ] No certificate/private key files
- [ ] `.gitignore` is committed to repository

---

## 📝 Recommended Repository Structure

### Files That SHOULD Be Committed:
- ✅ `appsettings.Example.json` - Template with placeholders
- ✅ `.gitignore` - Ignore rules
- ✅ `README.md` - Documentation
- ✅ Source code (`.cs`, `.ts`, `.tsx` files)
- ✅ Project files (`.csproj`, `package.json`)
- ✅ Configuration templates

### Files That SHOULD NOT Be Committed:
- ❌ `appsettings.json` - Real configuration with secrets
- ❌ `.env.local` - Environment variables
- ❌ `node_modules/` - Dependencies
- ❌ `bin/`, `obj/` - Build artifacts
- ❌ Log files
- ❌ User-uploaded files

---

## 🚨 If You've Already Committed Secrets

If you've already pushed secrets to GitHub:

1. **IMMEDIATELY** revoke/regenerate the exposed API keys:
   - Gemini API Key: Go to Google AI Studio and regenerate
   - JWT Secret: Generate a new one
   - Database password: Change it

2. **Remove from Git History** (see Action 4 above)

3. **Force Push** (only if repo is private and you're the only contributor):
   ```powershell
   git push --force
   ```

4. **If repo is public or shared**: Consider the secrets compromised and regenerate all of them.

---

## 📋 Quick Verification Script

Create a file `check-secrets.ps1`:

```powershell
Write-Host "Checking for sensitive files..." -ForegroundColor Yellow

# Check if appsettings.json is tracked
$tracked = git ls-files | Select-String "appsettings.json"
if ($tracked) {
    Write-Host "❌ ERROR: appsettings.json is tracked in git!" -ForegroundColor Red
    Write-Host "Run: git rm --cached backend/src/CustomerSupport.Api/appsettings.json" -ForegroundColor Yellow
} else {
    Write-Host "✅ appsettings.json is NOT tracked" -ForegroundColor Green
}

# Check for .env files
$envFiles = git ls-files | Select-String ".env"
if ($envFiles) {
    Write-Host "❌ ERROR: .env files are tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ .env files are NOT tracked" -ForegroundColor Green
}

# Check for node_modules
$nodeModules = git ls-files | Select-String "node_modules"
if ($nodeModules) {
    Write-Host "❌ ERROR: node_modules is tracked!" -ForegroundColor Red
} else {
    Write-Host "✅ node_modules is NOT tracked" -ForegroundColor Green
}

Write-Host "`nCheck complete!" -ForegroundColor Cyan
```

Run it: `.\check-secrets.ps1`

---

## ✅ Safe to Push Checklist

Before pushing to GitHub, verify:

1. ✅ No API keys in tracked files
2. ✅ No passwords in tracked files
3. ✅ No connection strings with real credentials
4. ✅ `appsettings.json` is NOT in git
5. ✅ `.gitignore` properly configured
6. ✅ Only `appsettings.Example.json` is committed (with placeholders)
7. ✅ No `.env` files committed
8. ✅ Build artifacts excluded
9. ✅ Log files excluded

---

**Remember:** When in doubt, don't commit it! It's better to be safe than sorry.

