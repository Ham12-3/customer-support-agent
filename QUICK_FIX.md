# 🚀 QUICK FIX - Login Error

## Your Error
```
❌ Failed login attempt for email: mobolaji2309@gmail.com
❌ HTTP POST /api/auth/login responded 401
```

## The Problem
**Your database is empty!** You need to create a user first.

## The Solution (Choose One)

### ⚡ FASTEST: Seed Test Users (30 seconds)

```powershell
.\seed-database.ps1
```

✅ Creates: `admin@testcompany.com` / `Admin123!`

Then login with these credentials!

---

### 🎯 RECOMMENDED: Register Your Account

**Option A - Using PowerShell:**
```powershell
$body = @{
    email = "mobolaji2309@gmail.com"
    password = "SecurePass123!"
    firstName = "Mobolaji"
    lastName = "LastName"
    companyName = "My Company"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST -ContentType "application/json" -Body $body
```

**Option B - Using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mobolaji2309@gmail.com",
    "password": "SecurePass123!",
    "firstName": "Mobolaji",
    "lastName": "LastName",
    "companyName": "My Company"
  }'
```

**Option C - Using Frontend:**
Go to: http://localhost:3000/register

---

## ✅ Test It Works

```powershell
.\test-auth.ps1
```

This will verify everything is working!

---

## 📚 Need More Help?

- 🔧 Quick reference: `LOGIN_FIX_SUMMARY.md`
- 📖 Complete guide: `AUTHENTICATION_GUIDE.md`
- 📋 All changes: `CHANGES_SUMMARY.md`

---

## 🎉 Done in 3 Steps!

```powershell
# Step 1: Seed database
.\seed-database.ps1

# Step 2: Test it
.\test-auth.ps1

# Step 3: Login!
# Go to: http://localhost:3000/login
# Email: admin@testcompany.com
# Password: Admin123!
```

**That's it!** 🚀
