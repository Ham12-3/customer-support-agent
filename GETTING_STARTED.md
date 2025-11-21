# 🚀 Getting Started - Quick Setup Guide

Welcome! This guide will help you get the AI Customer Support Agent Platform up and running on your local machine.

## ⏱️ Quick Start (5 minutes)

### Prerequisites

Make sure you have these installed:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) - `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Step 1: Clone and Setup (2 min)

```bash
# You're already in the project directory!
cd customer-support-agent

# Start the database services
docker-compose up -d

# Wait for services to be healthy (10-15 seconds)
docker-compose ps
```

You should see both `postgres` and `redis` with status "Up (healthy)".

---

### Step 2: Backend Setup (2 min)

```bash
# Navigate to backend
cd backend

# Restore NuGet packages
dotnet restore

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create database and apply migrations
dotnet ef migrations add InitialCreate \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api

dotnet ef database update \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api

# Run the API
dotnet run --project src/CustomerSupport.Api
```

**✅ Backend running at:** `http://localhost:5000`  
**📚 Swagger docs at:** `http://localhost:5000/swagger`

---

### Step 3: Frontend Setup (1 min)

Open a **new terminal** and:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Run the dashboard
pnpm dev
```

**✅ Dashboard running at:** `http://localhost:3000`

---

## 🎉 You're Ready!

### Test the Application

1. **Open your browser:** Go to `http://localhost:3000`

2. **Register a new account:**
   - Click "Register"
   - Fill in company details
   - Create your account

3. **Login:**
   - Use your email and password
   - Access the dashboard

4. **Explore the API:**
   - Visit `http://localhost:5000/swagger`
   - Try the API endpoints

---

## 🛠️ Development Workflow

### Backend Development

```bash
# From backend/ directory

# Run in watch mode (auto-reload on changes)
dotnet watch run --project src/CustomerSupport.Api

# Run tests
dotnet test

# Create new migration
dotnet ef migrations add MigrationName \
  --project src/CustomerSupport.Infrastructure \
  --startup-project src/CustomerSupport.Api
```

### Frontend Development

```bash
# From frontend/ directory

# Run dashboard
pnpm dev

# Lint code
pnpm lint

# Type check
pnpm type-check

# Build for production
pnpm build
```

---

## 🔍 Verify Everything Works

### Check Backend Health

```bash
curl http://localhost:5000/health
# Expected: {"status":"healthy","timestamp":"..."}
```

### Check Database Connection

```bash
docker exec -it customersupport-postgres psql -U postgres -d customersupport -c "\dt"
# Should show your database tables
```

### Check Redis Connection

```bash
docker exec -it customersupport-redis redis-cli ping
# Expected: PONG
```

---

## 📦 Project Structure

```
customer-support-agent/
├── backend/               # .NET 8 API
│   ├── src/
│   │   ├── CustomerSupport.Api/
│   │   ├── CustomerSupport.Core/
│   │   ├── CustomerSupport.Infrastructure/
│   │   └── CustomerSupport.Agent/
│   └── tests/
├── frontend/              # Next.js Dashboard
│   └── apps/
│       └── dashboard/
├── docker-compose.yml     # Database services
├── ARCHITECTURE_PLAN.md   # System architecture
├── IMPLEMENTATION_ROADMAP.md  # Development guide
└── QUICK_REFERENCE.md     # Command reference
```

---

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker logs customersupport-postgres
```

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Migration Errors

```bash
# Drop database and start fresh
dotnet ef database drop --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Recreate
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

### Frontend Build Errors

```bash
# Clean and reinstall
cd frontend
rm -rf node_modules .next
pnpm install
pnpm dev
```

---

## 🎯 Next Steps

Now that you're set up, here's what you can build next:

### Week 1-2: Extend Authentication
- [ ] Add password reset
- [ ] Implement email verification
- [ ] Add social login (Google, Microsoft)

### Week 3-4: Domain Management
- [ ] Add domain CRUD endpoints
- [ ] Build domain verification UI
- [ ] Generate widget embed scripts

### Week 5-6: Knowledge Base (Future)
- [ ] Document upload functionality
- [ ] PDF/DOCX parsing
- [ ] Embedding generation
- [ ] Vector storage

### Week 7-8: AI Agent (Future)
- [ ] Integrate OpenAI API
- [ ] Implement RAG pipeline
- [ ] Build chat interface
- [ ] Real-time messaging with SignalR

**Note:** Email notifications (SendGrid) have been removed as they're not essential for the core chat functionality. Notifications will be handled via in-app alerts and webhooks instead.

Follow the [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for detailed week-by-week guidance.

---

## 📚 Additional Resources

- **Architecture:** [ARCHITECTURE_PLAN.md](ARCHITECTURE_PLAN.md)
- **Project Structure:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Implementation Guide:** [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)
- **Command Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

- **Backend README:** [backend/README.md](backend/README.md)
- **Frontend README:** [frontend/README.md](frontend/README.md)

---

## 🤝 Need Help?

If you run into issues:

1. Check the **Troubleshooting** section above
2. Review the logs: `docker-compose logs -f`
3. Check backend logs in `backend/logs/`
4. Ensure all prerequisites are installed
5. Try restarting services: `docker-compose restart`

---

## 🎊 Congratulations!

You now have a fully functional development environment for building an enterprise-grade AI customer support platform! 

Happy coding! 🚀

