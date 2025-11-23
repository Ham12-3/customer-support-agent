# 🔐 Authentication & Login Guide

## 🚨 Common Login Error: "Failed login attempt"

If you're seeing this error in your logs:
```
[WRN] Failed login attempt for email: your@email.com
[INF] Executing UnauthorizedObjectResult
HTTP POST /api/auth/login responded 401
```

**This means:** The password verification failed. Either the user doesn't exist or the password is incorrect.

---

## ✅ Solutions

### Solution 1: Register a New User (Recommended)

The database starts empty. You need to **register first** before logging in.

#### Option A: Use the Frontend
1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Click "Register"
4. Use those credentials to login

#### Option B: Use the API Directly

**Register via cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "YourPassword123!",
    "firstName": "Your",
    "lastName": "Name",
    "companyName": "Your Company"
  }'
```

**Register via PowerShell:**
```powershell
$body = @{
    email = "your@email.com"
    password = "YourPassword123!"
    firstName = "Your"
    lastName = "Name"
    companyName = "Your Company"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### Solution 2: Seed Test Users (Development Only)

For development, you can seed the database with pre-configured test users.

#### Quick Method: Use the Seed Script

**Windows (Batch):**
```batch
seed-database.bat
```

**Windows (PowerShell):**
```powershell
.\seed-database.ps1
```

**Manual Method:**
```bash
cd backend/src/CustomerSupport.Api
dotnet run --seed-db
```

This creates two test users:
- **Admin User:** `admin@testcompany.com` / `Admin123!`
- **Regular User:** `test@testcompany.com` / `Test123!`

---

## 🔍 How to Debug Login Issues

### 1. Check if User Exists in Database

Connect to PostgreSQL:
```bash
docker exec -it customer-support-postgres psql -U admin -d customersupportdb
```

Then run:
```sql
-- List all users
SELECT "Id", "Email", "FirstName", "LastName", "Role", "IsActive" FROM users;

-- Check specific user
SELECT * FROM users WHERE "Email" = 'your@email.com';
```

Exit with: `\q`

### 2. Check Application Logs

Look for these patterns in your logs:

**User Not Found:**
```
[WRN] Failed login attempt for email: your@email.com
```
→ User doesn't exist. Register first!

**Password Mismatch:**
```
SELECT ... FROM users WHERE u."Email" = @__email_0
[WRN] Failed login attempt for email: your@email.com
```
→ User exists but password is wrong.

**Inactive Account:**
```
[WRN] Login attempt for inactive account: your@email.com
```
→ User is deactivated.

### 3. Verify Password Requirements

Passwords should:
- Be at least 8 characters long
- Contain uppercase and lowercase letters
- Contain at least one number
- Contain at least one special character

**Good Examples:**
- `Admin123!`
- `SecurePass123!`
- `MyPassword2024!`

---

## 🛠️ Advanced: Manual User Creation

If you need to create a specific user for testing, you can do it directly in the database:

```sql
-- Generate a BCrypt hash for password "Test123!"
-- Use an online BCrypt generator or create via C#

INSERT INTO tenants ("Id", "Name", "Email", "Status", "Plan", "CreatedAt")
VALUES (
    gen_random_uuid(),
    'Your Company',
    'your@email.com',
    0, -- Active
    0, -- Free plan
    NOW()
);

-- Get the tenant ID you just created
SELECT "Id" FROM tenants WHERE "Email" = 'your@email.com';

-- Insert user (replace YOUR_TENANT_ID with the ID from above)
INSERT INTO users (
    "Id", "TenantId", "Email", "FirstName", "LastName", 
    "PasswordHash", "Role", "IsActive", "CreatedAt"
)
VALUES (
    gen_random_uuid(),
    'YOUR_TENANT_ID'::uuid,
    'your@email.com',
    'Your',
    'Name',
    '$2a$11$YourBCryptHashHere', -- Replace with actual BCrypt hash
    0, -- Admin role
    true,
    NOW()
);
```

---

## 📝 Testing Your Login

After creating a user (via registration or seeding), test the login:

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testcompany.com",
    "password": "Admin123!"
  }'
```

**Expected Success Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "random-secure-string",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "uuid",
    "email": "admin@testcompany.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "Admin",
    "tenantId": "uuid",
    "tenantName": "Test Company"
  }
}
```

---

## 🔐 Security Best Practices

### Development Environment
- ✅ Use seed data with simple passwords
- ✅ Clear test data between tests
- ✅ Don't commit credentials to Git

### Production Environment
- ❌ NEVER use seed data in production
- ❌ NEVER use default/simple passwords
- ✅ Require strong passwords
- ✅ Implement rate limiting
- ✅ Add CAPTCHA for registration
- ✅ Enable email verification
- ✅ Implement 2FA for sensitive accounts

---

## 📚 Related Documentation

- **Authentication Flow:** See `ARCHITECTURE_PLAN.md` Section 4.1
- **API Endpoints:** Visit http://localhost:5000/swagger
- **Database Schema:** See `PROJECT_STRUCTURE.md`
- **Troubleshooting:** See `RUNNING_THE_APPLICATION.md`

---

## 🆘 Still Having Issues?

1. **Database Issues:**
   - Run: `docker-compose down -v` (⚠️ This deletes all data!)
   - Run: `docker-compose up -d`
   - Run: `dotnet ef database update` in the API project
   - Run: `.\seed-database.ps1` to add test users

2. **Password Issues:**
   - Ensure you're using the exact password you registered with
   - Passwords are case-sensitive
   - Check for extra spaces

3. **Connection Issues:**
   - Ensure PostgreSQL is running: `docker ps`
   - Check connection string in `appsettings.Development.json`
   - Test database connection: `docker exec -it customer-support-postgres pg_isready`

4. **Check Logs:**
   - Backend logs: Look at console output
   - Database logs: `docker logs customer-support-postgres`
   - File logs: Check `backend/src/CustomerSupport.Api/logs/`

---

**Need more help?** Check the full documentation in the repository root!
