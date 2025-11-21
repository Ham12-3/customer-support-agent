# 🚀 Quick Start Guide

## Prerequisites

1. ✅ Docker Desktop (running)
2. ✅ .NET 9 SDK
3. ✅ Node.js 18+ and npm

## First-Time Setup

### 1. Install Dependencies

```powershell
# Backend - no additional install needed (uses dotnet restore)

# Frontend Dashboard
cd frontend/apps/dashboard
npm install

# Frontend Widget
cd ../widget
npm install
```

### 2. Setup Database

```powershell
# From project root
.\setup-database.bat
```

## Running the Application

### Option 1: Automated (Recommended)

```powershell
# From project root
.\start-all-services.bat
```

This will start:
- ✅ Docker services (PostgreSQL + Redis)
- ✅ Backend API (port 5000)
- ✅ Dashboard (port 3000)
- ✅ Chat Widget (port 3001)

### Option 2: Manual

**Terminal 1 - Docker:**
```powershell
docker-compose up -d
```

**Terminal 2 - Backend:**
```powershell
cd backend\src\CustomerSupport.Api
dotnet run
```

**Terminal 3 - Dashboard:**
```powershell
cd frontend\apps\dashboard
npm run dev
```

**Terminal 4 - Widget:**
```powershell
cd frontend\apps\widget
npm run dev
```

## Access the Application

1. **Register/Login**: http://localhost:3000/register
2. **Dashboard**: http://localhost:3000/dashboard
3. **Add Domains**: http://localhost:3000/dashboard/domains
4. **Upload Documents**: http://localhost:3000/dashboard/knowledge-base
5. **View Conversations**: http://localhost:3000/dashboard/conversations

## Test the Chat Widget

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Test Website</h1>
  
  <!-- Get this script from your dashboard -->
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = 'http://localhost:3001/widget.js';
      script.setAttribute('data-api-key', 'YOUR_API_KEY');
      script.setAttribute('data-domain-id', 'YOUR_DOMAIN_ID');
      script.setAttribute('data-widget-url', 'http://localhost:3001');
      script.async = true;
      document.body.appendChild(script);
    })();
  </script>
</body>
</html>
```

## Common Issues

### "Docker is not running"
- Start Docker Desktop and wait for it to fully start

### "Port already in use"
- Close any existing services on ports 5000, 3000, or 3001
- Check for running `dotnet` or `node` processes

### "Database connection failed"
- Ensure PostgreSQL container is running: `docker ps`
- Wait a few seconds after starting Docker

### "Frontend not loading"
- Clear browser cache
- Delete `frontend/apps/dashboard/.next` folder
- Run `npm install` again

## Next Steps

📖 Read the full [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for:
- Detailed feature explanations
- Architecture overview
- Advanced features to implement
- Security best practices
- Deployment guide

## Need Help?

1. Check browser console for errors (F12)
2. Check backend logs in the terminal
3. Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
4. Check database connectivity: `docker exec -it customersupport-postgres psql -U postgres -d customersupport`

---

**Happy coding! 🎉**

