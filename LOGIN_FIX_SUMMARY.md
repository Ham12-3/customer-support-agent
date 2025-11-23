# 🔧 Login Error - Quick Fix

## ❌ Your Error
```
[WRN] Failed login attempt for email: mobolaji2309@gmail.com
HTTP POST /api/auth/login responded 401
```

## ✅ Root Cause
**The user doesn't exist in the database yet!** Your database starts empty - you need to register first.

## 🚀 Quick Solutions

### Option 1: Seed Test Users (Fastest - 30 seconds)
```powershell
# Run this in the project root
.\seed-database.ps1
```

This creates:
- **Email:** `admin@testcompany.com`  
- **Password:** `Admin123!`

Then login with these credentials!

### Option 2: Register Your Own Account
```powershell
# Register your account
$body = @{
    email = "mobolaji2309@gmail.com"
    password = "SecurePass123!"
    firstName = "Mobolaji"
    lastName = "Your-Last-Name"
    companyName = "Your Company"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Or register via the frontend: http://localhost:3000/register

### Option 3: Use cURL (Linux/Mac/Windows)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mobolaji2309@gmail.com",
    "password": "SecurePass123!",
    "firstName": "Mobolaji",
    "lastName": "Your-Last-Name",
    "companyName": "Your Company"
  }'
```

## 🧪 Test Your Fix
```powershell
# Run the test script
.\test-auth.ps1
```

This will verify everything is working!

## 📚 Full Documentation
See **AUTHENTICATION_GUIDE.md** for complete details, troubleshooting, and advanced options.

---

## 🎯 What I Fixed

I've added the following to your project:

### 1. Database Seeder (`backend/src/CustomerSupport.Infrastructure/Data/DbSeeder.cs`)
- Automatically creates test users for development
- Prevents duplicate seeding

### 2. Seeding Scripts
- `seed-database.bat` - Windows batch script
- `seed-database.ps1` - PowerShell script (recommended)

### 3. Updated Program.cs
- Now checks if database is empty on startup
- Shows helpful warning if no users exist
- Supports `--seed-db` flag to seed automatically

### 4. Test Script (`test-auth.ps1`)
- Tests if API is running
- Tests login with test credentials
- Tests authenticated endpoints
- Tests registration

### 5. Documentation
- **AUTHENTICATION_GUIDE.md** - Complete authentication guide
- **LOGIN_FIX_SUMMARY.md** - This file (quick reference)

---

## ⚡ Quickest Path to Success

```powershell
# 1. Seed the database (creates test users)
.\seed-database.ps1

# 2. Test that login works
.\test-auth.ps1

# 3. Open your browser and login
# Go to: http://localhost:3000/login
# Email: admin@testcompany.com
# Password: Admin123!
```

**Done!** You should now be able to login! 🎉

---

## 🆘 Still Not Working?

1. **Restart your backend:**
   ```powershell
   # Stop it with Ctrl+C, then restart
   cd backend/src/CustomerSupport.Api
   dotnet run
   ```

2. **Clear and recreate database:**
   ```powershell
   docker-compose down -v
   docker-compose up -d
   cd backend
   dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
   ```

3. **Check the full guide:**
   Open `AUTHENTICATION_GUIDE.md` for detailed troubleshooting

---

**Need immediate help?** Run `.\test-auth.ps1` and share the output!
