# 🚨 EMERGENCY: Secret Exposure Cleanup Plan

## ⚠️ CRITICAL: Secrets Exposed on GitHub

GitHub has detected exposed secrets in your repository. **IMMEDIATE ACTION REQUIRED!**

---

## 🔴 STEP 1: REVOKE EXPOSED SECRETS (DO THIS FIRST!)

### 1. Revoke Gemini API Key

**IMMEDIATELY go to Google AI Studio and:**
1. Visit: https://makersuite.google.com/app/apikey
2. Find the key: `AIzaSyDHd1cPWuu_9I_OBkyoRkyEasyVfoKQojQ`
3. **DELETE or REGENERATE** the key
4. This prevents unauthorized access

### 2. Regenerate JWT Secret

The JWT secret is also exposed. Generate a new one:
- Use a strong random string (at least 32 characters)
- Update it in your local `appsettings.json`
- All existing tokens will be invalidated (users will need to re-login)

---

## 🛠️ STEP 2: Remove Secrets from Git History

### Option A: Using git filter-branch (Recommended for small repos)

```powershell
# Navigate to your repository
cd C:\Users\mobol\Downloads\customer-support-agent

# Remove PRE_COMMIT_SECURITY_CHECKLIST.md from all commits
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch PRE_COMMIT_SECURITY_CHECKLIST.md" --prune-empty --tag-name-filter cat -- --all

# Remove appsettings.json from all commits (if it was committed)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/src/CustomerSupport.Api/appsettings.json" --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Option B: Using BFG Repo-Cleaner (Easier, but requires Java)

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```powershell
java -jar bfg.jar --delete-files PRE_COMMIT_SECURITY_CHECKLIST.md
java -jar bfg.jar --delete-files appsettings.json
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Option C: Delete and Recreate Repository (If repo is new/private)

If this is a new repository with few commits:
1. Delete the repository on GitHub
2. Remove the `.git` folder locally
3. Re-initialize git
4. Push fresh code (without secrets)

---

## 📝 STEP 3: Remove Secrets from Current Files

### 1. Delete PRE_COMMIT_SECURITY_CHECKLIST.md

This file contains the exposed API key in plain text:

```powershell
# Delete the file
Remove-Item PRE_COMMIT_SECURITY_CHECKLIST.md

# Or edit it to remove the API key line
```

### 2. Ensure appsettings.json is NOT tracked

```powershell
# Check if it's tracked
git ls-files | findstr appsettings.json

# If it shows up, remove it from tracking
git rm --cached backend/src/CustomerSupport.Api/appsettings.json

# Commit the removal
git commit -m "Remove sensitive configuration file from tracking"
```

### 3. Update .gitignore

Make sure `.gitignore` includes:
```gitignore
**/appsettings.json
**/appsettings.Development.json
PRE_COMMIT_SECURITY_CHECKLIST.md
```

---

## 🔍 STEP 4: Scan for Other Secrets

Run this to find other potential secrets:

```powershell
# Search for API keys
git log --all --source --full-history -p | findstr /i "AIzaSy\|sk-\|api.*key"

# Search for passwords
git log --all --source --full-history -p | findstr /i "password.*="

# Search for connection strings
git log --all --source --full-history -p | findstr /i "connectionstring"
```

---

## 🚀 STEP 5: Force Push (ONLY if repository is private!)

**WARNING:** Only do this if:
- Repository is **PRIVATE**
- You're the **ONLY** contributor
- You haven't shared the repository with others

```powershell
# Force push to overwrite history
git push origin --force --all
git push origin --force --tags
```

**If repository is PUBLIC or shared:**
- Consider the secrets **COMPROMISED**
- Revoke ALL exposed secrets
- Do NOT force push (it will break other people's clones)
- Instead, create a new commit that removes the secrets

---

## ✅ STEP 6: Verify Cleanup

### Check what will be pushed:

```powershell
# Check for secrets in staged files
git diff --cached | findstr /i "AIzaSy\|sk-\|password"

# Check for secrets in tracked files
git ls-files | xargs grep -l "AIzaSy\|sk-\|password" 2>$null

# Verify appsettings.json is NOT tracked
git ls-files | findstr appsettings.json
```

---

## 📋 Complete Cleanup Checklist

- [ ] **REVOKED** Gemini API key in Google AI Studio
- [ ] **GENERATED** new JWT secret
- [ ] **REMOVED** PRE_COMMIT_SECURITY_CHECKLIST.md from git history
- [ ] **REMOVED** appsettings.json from git history (if it was committed)
- [ ] **DELETED** PRE_COMMIT_SECURITY_CHECKLIST.md locally
- [ ] **VERIFIED** appsettings.json is in .gitignore
- [ ] **SCANNED** for other secrets in git history
- [ ] **UPDATED** local appsettings.json with new secrets
- [ ] **FORCE PUSHED** (if safe to do so)
- [ ] **VERIFIED** no secrets in current codebase

---

## 🔐 STEP 7: Update Local Configuration

After cleanup, update your local `appsettings.json`:

```json
{
  "Gemini": {
    "ApiKey": "YOUR_NEW_API_KEY_HERE",
    "Model": "gemini-3-flash",
    "MaxTokens": 2048,
    "Temperature": 0.7
  },
  "JWT": {
    "Secret": "YOUR_NEW_STRONG_SECRET_HERE_AT_LEAST_32_CHARACTERS",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": "60"
  }
}
```

---

## 🛡️ Prevention for Future

1. **Never commit files with real secrets**
2. **Always use .gitignore** for config files
3. **Use environment variables** instead of hardcoded secrets
4. **Use git-secrets** or similar tools to prevent accidental commits
5. **Review commits** before pushing
6. **Use GitHub's secret scanning** (already enabled)

---

## 📞 If Secrets Were Used Maliciously

If you suspect the exposed secrets were used:

1. **Check API usage logs** in Google AI Studio
2. **Monitor for unusual activity**
3. **Review access logs** if available
4. **Contact support** for the affected services
5. **Consider security audit** if sensitive data was exposed

---

## ⚡ Quick Commands Summary

```powershell
# 1. Revoke API key (do this in browser first!)

# 2. Remove file from git history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch PRE_COMMIT_SECURITY_CHECKLIST.md" --prune-empty --tag-name-filter cat -- --all

# 3. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Delete file locally
Remove-Item PRE_COMMIT_SECURITY_CHECKLIST.md

# 5. Verify
git ls-files | findstr PRE_COMMIT_SECURITY_CHECKLIST

# 6. Force push (if safe)
git push origin --force --all
```

---

**ACT NOW - Every minute counts!** ⏰

