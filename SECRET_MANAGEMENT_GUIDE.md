# 🔐 Complete Guide: How to Handle Secrets Properly

## 🎯 The Golden Rule

**NEVER commit files with real secrets to GitHub!**

---

## 📋 The Problem

You have secrets in `appsettings.json`:
- ❌ Gemini API Key
- ❌ JWT Secret
- ❌ Database Password

These should **NEVER** be in git!

---

## ✅ The Solution: Use Example Files

### Step 1: Keep Example Files in Git (Safe)

**File: `appsettings.Example.json`** ✅ (Safe to commit)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=customersupport;Username=postgres;Password=YOUR_PASSWORD_HERE;Port=5432",
    "Redis": "localhost:6379"
  },
  "JWT": {
    "Secret": "GENERATE_A_STRONG_SECRET_KEY_HERE_AT_LEAST_32_CHARACTERS",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": "60"
  },
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY_HERE",
    "Model": "gemini-3-flash",
    "MaxTokens": 2048,
    "Temperature": 0.7
  }
}
```

### Step 2: Keep Real Files Local Only (Never Commit)

**File: `appsettings.json`** ❌ (Never commit - already in .gitignore)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=127.0.0.1;Database=customersupport;Username=postgres;Password=postgres;Port=5432",
    "Redis": "localhost:6379"
  },
  "JWT": {
    "Secret": "ThisIsATemporarySecretKeyForDevelopmentPleaseChangeInProduction123!",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": "60"
  },
  "Gemini": {
    "ApiKey": "AIzaSyDHd1cPWuu_9I_OBkyoRkyEasyVfoKQojQ",
    "Model": "gemini-3-flash",
    "MaxTokens": 2048,
    "Temperature": 0.7
  }
}
```

**This file stays on your computer only!**

---

## 🛠️ How to Set Up Properly

### For New Developers (Setup Instructions)

1. **Clone the repository**
   ```powershell
   git clone https://github.com/yourusername/customer-support-agent.git
   cd customer-support-agent
   ```

2. **Copy the example file**
   ```powershell
   cd backend\src\CustomerSupport.Api
   Copy-Item appsettings.Example.json appsettings.json
   ```

3. **Edit `appsettings.json` with your real secrets**
   - Open `appsettings.json` in a text editor
   - Replace `YOUR_PASSWORD_HERE` with your database password
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your real API key
   - Replace `GENERATE_A_STRONG_SECRET_KEY_HERE...` with a strong random secret

4. **Verify it's ignored by git**
   ```powershell
   git status
   # appsettings.json should NOT appear in the list
   ```

---

## 📁 File Structure (What Goes Where)

### ✅ Files Safe to Commit (In Git)
```
backend/src/CustomerSupport.Api/
├── appsettings.Example.json  ✅ (Template with placeholders)
├── appsettings.Development.json  ✅ (If it has no secrets)
└── .gitignore  ✅ (Tells git what to ignore)
```

### ❌ Files Never Committed (Local Only)
```
backend/src/CustomerSupport.Api/
├── appsettings.json  ❌ (Contains real secrets - stays local)
└── appsettings.Production.json  ❌ (If it has secrets)
```

---

## 🔍 Verify Your Setup

### Check 1: Is appsettings.json ignored?

```powershell
# This should return NOTHING (empty)
git ls-files | findstr appsettings.json
```

**Expected:** No output (file is ignored) ✅

### Check 2: Is appsettings.Example.json tracked?

```powershell
# This SHOULD show the file
git ls-files | findstr appsettings.Example.json
```

**Expected:** `backend/src/CustomerSupport.Api/appsettings.Example.json` ✅

### Check 3: Check .gitignore

```powershell
# View .gitignore
Get-Content .gitignore | Select-String "appsettings"
```

**Expected:** Should see `**/appsettings.json` ✅

---

## 🚨 Common Mistakes (Don't Do These!)

### ❌ Mistake 1: Committing appsettings.json
```powershell
# DON'T DO THIS!
git add appsettings.json
git commit -m "Add config"
```

### ❌ Mistake 2: Putting secrets in documentation
```markdown
<!-- DON'T DO THIS! -->
The API key is: AIzaSyDHd1cPWuu_9I_OBkyoRkyEasyVfoKQojQ
```

### ❌ Mistake 3: Forgetting to update .gitignore
Make sure `.gitignore` includes:
```
**/appsettings.json
**/appsettings.*.json
!**/appsettings.Example.json
```

---

## ✅ Best Practices

### 1. Always Use Example Files

**Template file** (committed):
- `appsettings.Example.json`
- `.env.example`
- `config.example.json`

**Real file** (local only):
- `appsettings.json` (copy from example, add real secrets)
- `.env.local` (copy from .env.example, add real secrets)

### 2. Use Environment Variables (Even Better!)

Instead of hardcoding in `appsettings.json`, use environment variables:

**appsettings.json:**
```json
{
  "Gemini": {
    "ApiKey": "${GEMINI_API_KEY}"
  }
}
```

**Set environment variable:**
```powershell
$env:GEMINI_API_KEY = "your-real-api-key"
```

### 3. Use User Secrets (For .NET Development)

```powershell
# Set a secret (stored securely, not in files)
dotnet user-secrets set "Gemini:ApiKey" "your-real-api-key"
```

Then in `appsettings.json`:
```json
{
  "Gemini": {
    "ApiKey": ""  // Will be loaded from user secrets
  }
}
```

---

## 📝 Step-by-Step: Setting Up Your Project

### Initial Setup (First Time)

1. **Check if appsettings.json exists**
   ```powershell
   Test-Path backend\src\CustomerSupport.Api\appsettings.json
   ```

2. **If it doesn't exist, copy from example**
   ```powershell
   cd backend\src\CustomerSupport.Api
   Copy-Item appsettings.Example.json appsettings.json
   ```

3. **Edit appsettings.json with your secrets**
   - Open in VS Code or Notepad
   - Replace all `YOUR_*_HERE` placeholders with real values

4. **Verify it's ignored**
   ```powershell
   git status
   # appsettings.json should NOT appear
   ```

### Daily Development

1. **Never commit appsettings.json**
   ```powershell
   # Always check before committing
   git status
   # If appsettings.json appears, DON'T commit it!
   ```

2. **If you accidentally stage it**
   ```powershell
   # Remove it from staging
   git reset HEAD appsettings.json
   ```

---

## 🔄 What to Do Right Now

### Step 1: Verify .gitignore

Check that `.gitignore` has:
```gitignore
**/appsettings.json
**/appsettings.Development.json
**/appsettings.*.json
!**/appsettings.Example.json
```

### Step 2: Check Current Status

```powershell
# See what's tracked
git ls-files | findstr appsettings

# See what's staged
git status
```

### Step 3: If appsettings.json is Tracked

```powershell
# Remove from git (but keep local file)
git rm --cached backend/src/CustomerSupport.Api/appsettings.json

# Commit the removal
git commit -m "Remove appsettings.json from tracking"
```

### Step 4: Ensure appsettings.Example.json Exists

```powershell
# Check if it exists
Test-Path backend\src\CustomerSupport.Api\appsettings.Example.json

# If not, create it from appsettings.json (then remove secrets)
```

---

## 🎓 Quick Reference

| File | Commit to Git? | Contains |
|------|---------------|----------|
| `appsettings.Example.json` | ✅ YES | Placeholders like `YOUR_API_KEY_HERE` |
| `appsettings.json` | ❌ NO | Real secrets |
| `.env.example` | ✅ YES | Placeholders |
| `.env.local` | ❌ NO | Real secrets |
| `.gitignore` | ✅ YES | Rules for ignoring files |

---

## 🛡️ Security Checklist

Before every commit:

- [ ] `git status` - Check what's being committed
- [ ] No `appsettings.json` in the list
- [ ] No `.env.local` in the list
- [ ] No API keys in code comments
- [ ] No passwords in documentation
- [ ] Only example/template files are committed

---

## 💡 Remember

1. **Example files** = Safe to commit (have placeholders)
2. **Real config files** = Never commit (have actual secrets)
3. **Always check** `git status` before committing
4. **When in doubt**, don't commit it!

---

## 🆘 If You Accidentally Committed Secrets

1. **IMMEDIATELY revoke** the exposed secrets
2. **Remove from git history** (use cleanup-secrets.ps1)
3. **Force push** (only if private repo)
4. **Generate new secrets**

---

**The key is: Keep secrets local, commit only templates!** 🔐

