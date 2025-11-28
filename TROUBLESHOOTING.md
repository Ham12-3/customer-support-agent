# 🔧 Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Login Fails with 401 Unauthorized

**Symptom:**
```
[WRN] Failed login attempt for email: your@email.com
HTTP POST /api/auth/login responded 401
```

**Causes:**
- Wrong password
- User doesn't exist
- Account is inactive

**Solutions:**

#### Option A: Reset Database (Easiest)
```bash
# Windows
.\reset-database.bat

# PowerShell/Mac/Linux
pwsh reset-database.ps1
```

This will:
- Drop and recreate the database
- Create a test user: `admin@test.com` / `Test123!`

#### Option B: Register a New User
1. Go to `http://localhost:3000/register`
2. Create a new account with a different email
3. Remember the password you set!

#### Option C: Check Database
```bash
# Connect to PostgreSQL
docker exec -it customersupport-postgres psql -U postgres -d customersupport

# List all users
SELECT "Email", "FirstName", "LastName", "IsActive" FROM users;

# Delete a user
DELETE FROM users WHERE "Email" = 'your@email.com';

# Exit
\q
```

---

### 2. Database Connection Error

**Symptom:**
```
Npgsql.NpgsqlException: Connection refused
```

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps

# If not running, start it
docker-compose up -d postgres

# Wait for it to be ready
docker-compose ps
```

---

### 3. Migration Issues

**Symptom:**
```
A migration has already been applied to the database
```

**Solution:**

#### To reset migrations:
```bash
cd backend

# Drop database
dotnet ef database drop --force \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api

# Reapply migrations
dotnet ef database update \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api
```

#### To create a new migration:
```bash
cd backend

# Add migration
dotnet ef migrations add YourMigrationName \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api

# Apply it
dotnet ef database update \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api
```

---

### 4. Frontend Can't Connect to Backend

**Symptom:**
```
Failed to fetch
Network Error
```

**Checklist:**
1. ✅ Backend is running on `http://localhost:5000`
2. ✅ Check `frontend/.env.local` has:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. ✅ CORS is configured in `backend/src/CustomerSupport.Api/appsettings.json`

---

### 5. "No Refresh Token" Error

**Cause:** This is a symptom, not the root cause. The refresh token is only returned when login succeeds.

**Fix:** Solve the login issue first (see #1 above)

---

### 6. Docker Compose Fails

**Symptom:**
```
Error: Cannot connect to Docker daemon
```

**Solution:**
1. Start Docker Desktop
2. Wait for it to fully initialize (whale icon should be stable)
3. Try again: `docker-compose up -d`

---

### 7. Port Already in Use

**Symptom:**
```
Error: Port 5000 is already in use
Error: Port 3000 is already in use
```

**Solution:**

#### Windows:
```powershell
# Find what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

#### Mac/Linux:
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🗄️ Database Management Commands

### Quick Reset (Recommended for Development)
```bash
# Windows
.\reset-database.bat

# PowerShell
pwsh .\reset-database.ps1
```

### Manual Database Operations

#### View All Users
```bash
docker exec -it customersupport-postgres psql -U postgres -d customersupport -c \
  "SELECT \"Email\", \"FirstName\", \"LastName\", \"Role\", \"IsActive\" FROM users;"
```

#### Delete All Users
```bash
docker exec -it customersupport-postgres psql -U postgres -d customersupport -c \
  "DELETE FROM users; DELETE FROM tenants;"
```

#### Check Database Connection
```bash
docker exec -it customersupport-postgres psql -U postgres -c "\l"
```

---

## 🔐 Creating Test Users

### Method 1: Use Registration Endpoint (Recommended)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "YourPassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Test Company"
  }'
```

### Method 2: Use Frontend
1. Go to `http://localhost:3000/register`
2. Fill in the form
3. Click "Register"

### Method 3: Direct Database Insert (Advanced)
```sql
-- Connect to database first
docker exec -it customersupport-postgres psql -U postgres -d customersupport

-- Create tenant
INSERT INTO tenants ("Id", "Name", "Email", "Status", "Plan", "CreatedAt")
VALUES (
  gen_random_uuid(),
  'My Company',
  'admin@company.com',
  1,
  0,
  NOW()
);

-- Create user (password is: Test123!)
INSERT INTO users ("Id", "TenantId", "Email", "FirstName", "LastName", "PasswordHash", "Role", "IsActive", "CreatedAt")
VALUES (
  gen_random_uuid(),
  (SELECT "Id" FROM tenants WHERE "Email" = 'admin@company.com'),
  'admin@company.com',
  'Admin',
  'User',
  '$2a$11$rG7VLnZXKqMQQhF7zQQG0.p5JqXK5rG7VLnZXKqMQQhF7zQQG0.',
  0,
  true,
  NOW()
);
```

---

## 📋 Health Checks

### Backend Health
```bash
curl http://localhost:5000/health
# Expected: {"status":"Healthy"}
```

### Database Health
```bash
docker exec customersupport-postgres pg_isready -U postgres
# Expected: accepting connections
```

### Redis Health
```bash
docker exec customersupport-redis redis-cli ping
# Expected: PONG
```

---

## 🐛 Debug Mode

### Enable Detailed Logging

Edit `backend/src/CustomerSupport.Api/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore": "Information",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

### View Real-time Logs

#### Backend:
```bash
# If running with dotnet watch
# Logs appear in terminal

# If running in Docker:
docker logs -f customersupport-backend
```

#### Database:
```bash
docker logs -f customersupport-postgres
```

---

## 🆘 Still Having Issues?

### Collect Information
1. What command did you run?
2. What error message did you get?
3. Are Docker containers running? (`docker ps`)
4. Is the backend running? (check `http://localhost:5000/swagger`)
5. Check logs in `backend/src/CustomerSupport.Api/logs/`

### Complete Reset (Nuclear Option)
```bash
# Stop everything
docker-compose down -v

# Remove all containers and volumes
docker-compose rm -f -v

# Start fresh
docker-compose up -d
cd backend
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Create test user
.\reset-database.bat
```

---

## 📞 Quick Commands Reference

```bash
# Start everything
.\start-dev.bat              # Windows
pwsh .\start-dev.ps1         # PowerShell/Mac/Linux

# Stop everything
.\stop-dev.bat               # Windows
pwsh .\stop-dev.ps1          # PowerShell/Mac/Linux

# Reset database
.\reset-database.bat         # Windows

# View logs
cd backend/src/CustomerSupport.Api/logs
cat log-<date>.txt

# Check running services
docker ps
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux
```

---

**Last Updated:** November 2024

