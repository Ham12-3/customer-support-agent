# 🚨 QUICK FIX - Login Issues

## Your Problem

You're getting **401 Unauthorized** when trying to login with `mobolaji2309@gmail.com`.

```
[WRN] Failed login attempt for email: mobolaji2309@gmail.com
HTTP POST /api/auth/login responded 401
```

## Why This Happens

The password you're entering **doesn't match** the password hash in the database. This happens when:
1. You forgot your password
2. The database has old/corrupted data
3. You're using the wrong password

## ⚡ FASTEST FIX (2 minutes)

### Option 1: Reset Everything (Recommended)

```powershell
# Run this from project root
.\reset-database.ps1
```

This will:
- ✅ Drop and recreate the database
- ✅ Create a fresh test user
- ✅ Give you known credentials

**New Login Credentials:**
- 📧 **Email:** `admin@test.com`
- 🔑 **Password:** `Test123!`

---

### Option 2: Register a New Account

1. Go to: `http://localhost:3000/register`
2. Use a **different email** (not `mobolaji2309@gmail.com`)
3. Create your account
4. You'll be auto-logged in!

---

### Option 3: Delete Your Old User

```powershell
# Connect to database
docker exec -it customersupport-postgres psql -U postgres -d customersupport

# Delete your user
DELETE FROM users WHERE "Email" = 'mobolaji2309@gmail.com';

# Exit
\q
```

Then register again with the same email at `http://localhost:3000/register`

---

## 🗄️ How to Set Up Database (First Time)

### Full Setup Process

```powershell
# 1. Start Docker containers
docker-compose up -d

# 2. Navigate to backend
cd backend

# 3. Apply migrations (creates database schema)
dotnet ef database update `
  --project src/CustomerSupport.Infrastructure `
  --startup-project src/CustomerSupport.Api

# 4. Go back to root
cd ..

# 5. Reset database with test user
.\reset-database.ps1
```

---

## 🔍 Verify Database is Running

```powershell
# Check Docker containers
docker ps

# You should see:
# - customersupport-postgres
# - customersupport-redis

# Test database connection
docker exec customersupport-postgres pg_isready -U postgres
# Expected output: accepting connections
```

---

## 📋 Start the Application

```powershell
# Option A: Automated script
.\start-dev.ps1

# Option B: Manual
# Terminal 1 - Backend
cd backend/src/CustomerSupport.Api
dotnet watch run

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

---

## ✅ Test Login

1. Open: `http://localhost:3000`
2. Click **Login**
3. Enter credentials:
   - **Email:** `admin@test.com`
   - **Password:** `Test123!`
4. Click **Sign In**

You should now be logged in! 🎉

---

## 🆘 Still Not Working?

### Check Logs

```powershell
# Backend logs
cd backend/src/CustomerSupport.Api/logs
cat log-<today's-date>.txt

# Docker logs
docker logs customersupport-postgres
```

### Nuclear Option (Complete Reset)

```powershell
# Stop everything
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait 10 seconds
Start-Sleep -Seconds 10

# Reset database
.\reset-database.ps1

# Start application
.\start-dev.ps1
```

---

## 💡 Understanding the Error

Your error log shows:

```
SELECT u."Id", ... FROM users AS u
INNER JOIN tenants AS t ON u."TenantId" = t."Id"
WHERE u."Email" = 'mobolaji2309@gmail.com'
LIMIT 1
```

This query **succeeds** (found your user), but then:

```
[WRN] Failed login attempt for email: mobolaji2309@gmail.com
```

This means the **password verification failed** at this line in `AuthService.cs`:

```csharp
if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
{
    _logger.LogWarning("Failed login attempt for email: {Email}", dto.Email);
    return Result<AuthResponseDto>.Failure("Invalid email or password");
}
```

The password you entered doesn't match the hashed password in the database.

---

## 🔐 About Refresh Tokens

> "as i am getting no refresh token"

You're not getting a refresh token because **login is failing**. Refresh tokens are only returned on **successful** login.

Once you fix the login issue (using any option above), you'll receive:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "7f8e9d...",
  "expiresAt": "2024-11-23T21:45:29Z",
  "user": { ... }
}
```

---

## 📞 Quick Commands Cheatsheet

```powershell
# Reset database (fixes most issues)
.\reset-database.ps1

# Start everything
.\start-dev.ps1

# Stop everything
.\stop-dev.ps1

# Check what's running
docker ps
netstat -ano | findstr :5000

# View database users
docker exec -it customersupport-postgres psql -U postgres -d customersupport `
  -c "SELECT \"Email\", \"FirstName\", \"IsActive\" FROM users;"
```

---

**Need more help?** See `TROUBLESHOOTING.md` for detailed solutions.

