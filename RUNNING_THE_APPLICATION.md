# 🚀 Running the Application

**Complete step-by-step guide to run the Customer Support Agent Platform**

---

## 📋 Prerequisites

Make sure you have the following installed on your Windows machine:

### Required
- ✅ **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- ✅ **pnpm** - Install via: `npm install -g pnpm`

### Optional (Recommended)
- **Visual Studio 2022** or **VS Code** with C# extensions
- **Git** for version control

### Verify Installations
```powershell
# Check .NET version
dotnet --version
# Should show: 8.0.x

# Check Node version
node --version
# Should show: v18.x.x or higher

# Check pnpm
pnpm --version
# Should show: 8.x.x or higher

# Check Docker
docker --version
# Should show: Docker version 24.x.x or higher
```

---

## 🗄️ Step 1: Start the Databases

### Start PostgreSQL and Redis with Docker

```powershell
# Navigate to project root
cd C:\Users\mobol\Downloads\customer-support-agent

# Start databases (PostgreSQL + Redis)
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Expected Output:**
```
NAME                          IMAGE                  STATUS
customersupport-postgres      postgres:16-alpine     Up (healthy)
customersupport-redis         redis:7-alpine         Up (healthy)
```

### Verify Database Connection
```powershell
# Test PostgreSQL connection
docker exec -it customersupport-postgres psql -U postgres -d customersupport -c "SELECT 1;"

# Test Redis connection
docker exec -it customersupport-redis redis-cli ping
# Should return: PONG
```

### If Containers Don't Start
```powershell
# View logs
docker-compose logs

# Stop and remove containers
docker-compose down

# Remove volumes and start fresh
docker-compose down -v
docker-compose up -d
```

---

## 🔧 Step 2: Set Up the Backend (.NET)

### Navigate to Backend Directory
```powershell
cd backend
```

### Install .NET Tools (if needed)
```powershell
# Install EF Core tools globally
dotnet tool install --global dotnet-ef

# Or update if already installed
dotnet tool update --global dotnet-ef

# Verify installation
dotnet ef --version
# Should show: 8.0.x
```

### Restore NuGet Packages
```powershell
# Restore all dependencies
dotnet restore
```

### Create Database Migration
```powershell
# Create initial migration
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Apply migration to database
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

**What this does:**
- Creates migration files in `Infrastructure/Data/Migrations/`
- Creates all tables (Tenants, Users, Domains, Conversations, Messages, Documents, DocumentChunks)
- Sets up all relationships and indexes

### Build the Solution
```powershell
# Build entire solution
dotnet build

# Or build in Release mode
dotnet build --configuration Release
```

### Run the Backend API
```powershell
# Run from the API project directory
cd src/CustomerSupport.Api

# Run the API (Development mode)
dotnet run

# Or use watch mode (auto-restart on changes)
dotnet watch run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### Test Backend is Running
Open browser and navigate to:
- **API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger

You should see the Swagger API documentation page.

---

## 🎨 Step 3: Set Up the Frontend (Next.js)

### Open a NEW Terminal Window
Keep the backend running in the first terminal.

### Navigate to Frontend Directory
```powershell
cd C:\Users\mobol\Downloads\customer-support-agent\frontend
```

### Install Dependencies
```powershell
# Install all npm packages using pnpm
pnpm install

# This will install dependencies for:
# - Root workspace
# - apps/dashboard
# - Any shared packages
```

### Create Environment File
```powershell
# Navigate to dashboard app
cd apps/dashboard

# Create .env.local file
New-Item -Path .env.local -ItemType File -Force
```

### Add Environment Variables
Edit `apps/dashboard/.env.local` and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Run the Frontend
```powershell
# From frontend/apps/dashboard directory
pnpm dev

# Or from frontend root (using Turborepo)
cd ../..
pnpm dev
```

**Expected Output:**
```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Test Frontend is Running
Open browser and navigate to:
- **Frontend:** http://localhost:3000

You should see the Customer Support Agent Platform landing page.

---

## ✅ Step 4: Test the Application

### Register a New Account
1. Go to http://localhost:3000
2. Click **"Register"**
3. Fill in the form:
   - **Company Name:** Test Company
   - **Email:** admin@test.com
   - **First Name:** John
   - **Last Name:** Doe
   - **Password:** Test123!
   - **Confirm Password:** Test123!
4. Click **"Create account"**

You should be automatically logged in and redirected to the dashboard.

### Login
1. Go to http://localhost:3000/login
2. Enter credentials:
   - **Email:** admin@test.com
   - **Password:** Test123!
3. Click **"Sign in"**

You should be redirected to the dashboard.

### Check Backend Logs
In your backend terminal, you should see:
```
info: CustomerSupport.Api.Controllers.AuthController[0]
      Attempting to register new tenant for email: admin@test.com
info: CustomerSupport.Api.Controllers.AuthController[0]
      Registration successful for email: admin@test.com
```

---

## 🔍 Troubleshooting

### Backend Issues

#### "Unable to connect to database"
```powershell
# Check if PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres

# Test connection manually
docker exec -it customersupport-postgres psql -U postgres -c "\l"
```

#### "Port 5000 is already in use"
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in launchSettings.json
```

#### "Could not find a part of the path"
```powershell
# Make sure you're in the correct directory
cd C:\Users\mobol\Downloads\customer-support-agent\backend\src\CustomerSupport.Api

# Check the path
pwd
```

#### "Migration failed"
```powershell
# Drop the database and recreate
dotnet ef database drop --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api --force

# Recreate with migration
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

### Frontend Issues

#### "Module not found"
```powershell
# Delete node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
pnpm install
```

#### "Port 3000 is already in use"
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use a different port
pnpm dev -- -p 3001
```

#### "Cannot connect to API"
```powershell
# Check backend is running
# Visit http://localhost:5000/swagger

# Check CORS settings in backend appsettings.json
# Should include: "http://localhost:3000"

# Check .env.local file exists
cd frontend/apps/dashboard
cat .env.local
```

#### "API calls returning 401 Unauthorized"
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Try logging in again
- Check JWT token in localStorage (should exist after login)

### Docker Issues

#### "Docker daemon is not running"
```powershell
# Start Docker Desktop
# Wait for it to fully start (whale icon in system tray)

# Verify
docker ps
```

#### "Port 5432 already in use"
```powershell
# Another PostgreSQL instance is running
# Option 1: Stop the other instance
# Option 2: Change port in docker-compose.yml

# Edit docker-compose.yml
ports:
  - "5433:5432"  # Changed from 5432

# Update connection string in appsettings.json
"DefaultConnection": "Host=localhost;Database=customersupport;Username=postgres;Password=postgres;Port=5433"
```

---

## 🛠️ Development Commands

### Backend
```powershell
# From backend/ directory

# Build
dotnet build

# Run
dotnet run --project src/CustomerSupport.Api

# Watch (auto-restart)
dotnet watch run --project src/CustomerSupport.Api

# Run tests
dotnet test

# Clean
dotnet clean

# Create migration
dotnet ef migrations add MigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Apply migration
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Rollback migration
dotnet ef database update PreviousMigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Remove last migration
dotnet ef migrations remove --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

### Frontend
```powershell
# From frontend/ directory

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check

# Clean build artifacts
pnpm clean
```

### Docker
```powershell
# From project root

# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes data!)
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker exec -it customersupport-postgres psql -U postgres
```

---

## 📁 Project Structure Quick Reference

```
customer-support-agent/
├── backend/                          # .NET 8 Backend
│   ├── src/
│   │   ├── CustomerSupport.Api/      # Web API (Port 5000)
│   │   ├── CustomerSupport.Core/     # Domain Models & Interfaces
│   │   ├── CustomerSupport.Infrastructure/  # Data Access & Services
│   │   └── CustomerSupport.Agent/    # AI Agent (Future)
│   └── tests/                        # Unit Tests
├── frontend/                         # Next.js 14 Frontend
│   └── apps/
│       └── dashboard/                # Dashboard App (Port 3000)
├── docker-compose.yml                # Database Services
└── docs/                            # Documentation
```

---

## 🔗 Important URLs

### Development
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Database Credentials
- **Host:** localhost
- **Port:** 5432
- **Database:** customersupport
- **Username:** postgres
- **Password:** postgres

---

## 🚦 Starting Everything (Quick Start)

### PowerShell Script (Run All)
Create a file called `start.ps1`:

```powershell
# Start databases
Write-Host "Starting databases..." -ForegroundColor Green
docker-compose up -d

Write-Host "Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start backend
Write-Host "Starting backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend\src\CustomerSupport.Api; dotnet watch run"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; pnpm dev"

Write-Host "`nApplication started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000/swagger" -ForegroundColor Cyan
```

Run it:
```powershell
.\start.ps1
```

### Stopping Everything
```powershell
# Stop Docker containers
docker-compose stop

# Stop .NET API (Ctrl+C in its terminal)
# Stop Next.js (Ctrl+C in its terminal)
```

---

## 📝 Notes

### First Time Setup
1. ✅ Install prerequisites
2. ✅ Start Docker containers
3. ✅ Run database migration
4. ✅ Install frontend dependencies
5. ✅ Create .env.local file
6. ✅ Start backend
7. ✅ Start frontend
8. ✅ Test registration

### Subsequent Runs
1. ✅ Start Docker containers (if stopped)
2. ✅ Start backend
3. ✅ Start frontend

### Database Persistence
- Data is stored in Docker volumes
- Data persists between container restarts
- To reset database: `docker-compose down -v` (WARNING: deletes all data!)

### Hot Reload
- **Backend:** Use `dotnet watch run` for auto-restart on code changes
- **Frontend:** Next.js has built-in hot reload

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Docker shows both containers as "healthy"
2. ✅ Backend swagger page loads at http://localhost:5000/swagger
3. ✅ Frontend loads at http://localhost:3000
4. ✅ You can register a new account
5. ✅ You can login successfully
6. ✅ Dashboard page shows your user info

---

## 🆘 Getting Help

If you're stuck:
1. Check the **Troubleshooting** section above
2. Check backend logs in the terminal
3. Check frontend console (F12 in browser)
4. Check Docker logs: `docker-compose logs`
5. Review the error message carefully

Most common issues:
- Docker not running
- Wrong directory
- Port already in use
- Missing .env.local file
- Database not migrated

---

**Happy Coding! 🚀**

