# 🔐 Simple Secret Management Guide

## 🎯 The Basic Concept

Think of it like this:

```
📁 Your Project
├── 📄 appsettings.Example.json  ✅ GOES TO GITHUB (Safe - has placeholders)
└── 📄 appsettings.json         ❌ STAYS ON YOUR COMPUTER (Has real secrets)
```

---

## 📝 Two Files, Two Purposes

### File 1: `appsettings.Example.json` ✅
**Purpose:** Template for other developers  
**Contains:** Placeholders like `YOUR_API_KEY_HERE`  
**Git Status:** ✅ **COMMIT THIS** (Safe to share)

```json
{
  "Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY_HERE"  ← Placeholder
  }
}
```

### File 2: `appsettings.json` ❌
**Purpose:** Your actual configuration  
**Contains:** Real secrets like `AIzaSyDHd1cPWuu_9I_OBkyoRkyEasyVfoKQojQ`  
**Git Status:** ❌ **NEVER COMMIT THIS** (Stays on your computer only)

```json
{
  "Gemini": {
    "ApiKey": "AIzaSyDHd1cPWuu_9I_OBkyoRkyEasyVfoKQojQ"  ← Real secret
  }
}
```

---

## ✅ How It Works

### When You Clone the Repo:

1. You get `appsettings.Example.json` (with placeholders)
2. You copy it to `appsettings.json`
3. You fill in your real secrets
4. Git ignores `appsettings.json` (because of .gitignore)

### When You Commit:

1. ✅ `appsettings.Example.json` → Goes to GitHub (safe)
2. ❌ `appsettings.json` → Stays on your computer (ignored by git)

---

## 🛠️ Step-by-Step Setup

### Step 1: Check Your .gitignore

Open `.gitignore` and make sure it has:
```
**/appsettings.json
```

### Step 2: Verify appsettings.json is Ignored

Run this command:
```powershell
git status
```

**If `appsettings.json` appears in the list:** ❌ Problem!  
**If `appsettings.json` does NOT appear:** ✅ Good!

### Step 3: Always Check Before Committing

Before every `git commit`, run:
```powershell
git status
```

**If you see `appsettings.json`:** 
```powershell
# Remove it from staging
git reset HEAD backend/src/CustomerSupport.Api/appsettings.json
```

---

## 🎓 The Rule of Thumb

### ✅ Safe to Commit:
- Files with `.Example` in the name
- Files with placeholders like `YOUR_*_HERE`
- Template files
- Documentation (without real secrets)

### ❌ Never Commit:
- Files with real API keys
- Files with real passwords
- Files with real secrets
- `appsettings.json` (unless it only has placeholders)

---

## 🔍 Quick Check Commands

### Check if appsettings.json is tracked:
```powershell
git ls-files | findstr appsettings.json
```
**Should return:** Nothing (empty)

### Check what's staged for commit:
```powershell
git status
```
**Should NOT show:** `appsettings.json`

### Check if it's in .gitignore:
```powershell
Get-Content .gitignore | Select-String "appsettings"
```
**Should show:** `**/appsettings.json`

---

## 🚨 What to Do Right Now

### 1. Verify Setup
```powershell
.\verify-secrets-setup.ps1
```

This will tell you if everything is configured correctly.

### 2. If appsettings.json is Tracked

Remove it from git (but keep the local file):
```powershell
git rm --cached backend/src/CustomerSupport.Api/appsettings.json
git commit -m "Remove appsettings.json from tracking"
```

### 3. Before Every Commit

Always run:
```powershell
git status
```

Make sure `appsettings.json` is NOT in the list!

---

## 💡 Remember

**The secret stays on YOUR computer. Only the template goes to GitHub!**

```
Your Computer          GitHub
─────────────────      ────────────────
appsettings.json  ❌   (not here)
appsettings.Example.json  ✅   appsettings.Example.json
```

---

## ✅ Checklist

Before pushing to GitHub:

- [ ] `git status` shows NO `appsettings.json`
- [ ] `appsettings.Example.json` exists (with placeholders)
- [ ] `.gitignore` includes `**/appsettings.json`
- [ ] No real secrets in any files you're committing
- [ ] Run `.\verify-secrets-setup.ps1` and it passes

---

**That's it! Keep secrets local, commit only templates!** 🔐

