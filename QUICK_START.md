# ⚡ Quick Start Guide

**Get up and running in 5 minutes!**

---

## 🎯 Fastest Way to Start

### Option 1: Use PowerShell Script (Easiest!)

```powershell
# Run the startup script
.\start-dev.ps1
```

This will automatically:
- ✅ Start Docker containers
- ✅ Check for migrations
- ✅ Install frontend dependencies
- ✅ Create .env.local file
- ✅ Start backend and frontend

### Option 2: Manual Steps

#### 1. Start Databases
```powershell
docker-compose up -d
```

#### 2. Create Database Migration (First Time Only)
```powershell
cd backend
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

#### 3. Start Backend
```powershell
cd backend/src/CustomerSupport.Api
dotnet watch run
```

#### 4. Start Frontend (New Terminal)
```powershell
cd frontend
pnpm install  # First time only
pnpm dev
```

---

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:5000/swagger
- **Backend:** http://localhost:5000

---

## ✅ First Time Setup

1. Go to http://localhost:3000
2. Click **Register**
3. Create your account:
   - Company Name: Your Company
   - Email: admin@yourcompany.com
   - Password: YourPassword123!
4. You'll be auto-logged in! 🎉

---

## 🛑 Stopping

```powershell
# Stop databases
docker-compose stop

# Or use the script
.\stop-dev.ps1

# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
```

---

## 📚 Need More Help?

See **RUNNING_THE_APPLICATION.md** for:
- Detailed prerequisites
- Troubleshooting
- Development commands
- Full explanations

---

**That's it! Happy coding! 🚀**


