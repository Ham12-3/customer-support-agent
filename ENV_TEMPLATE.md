# Environment Variables Template

This file contains all environment variables used across the application. Use this as a reference when setting up your local environment or deploying to production.

## 📋 Backend (.NET API)

These can be set using:
- **.NET User Secrets** (recommended for development): `dotnet user-secrets set "Key:SubKey" "value"`
- **.env file** (with DotNetEnv package)
- **Environment variables** (for production)

### Gemini AI Configuration
```
Gemini:ApiKey = your_gemini_api_key_here
Gemini:Model = gemini-3-flash
Gemini:MaxTokens = 2048
Gemini:Temperature = 0.7
```

### Database Configuration (PostgreSQL)
```
ConnectionStrings:DefaultConnection = Host=127.0.0.1;Database=customersupport;Username=postgres;Password=your_password;Port=5432;SSL Mode=Disable;Timeout=30;
```

Or individually:
```
DB_HOST = 127.0.0.1
DB_PORT = 5432
DB_NAME = customersupport
DB_USER = postgres
DB_PASSWORD = your_postgres_password_here
```

### Redis Configuration
```
ConnectionStrings:Redis = localhost:6379
```

### JWT Authentication
```
JWT:Secret = your_very_strong_jwt_secret_at_least_64_characters_long
JWT:Issuer = CustomerSupportAgent
JWT:Audience = CustomerSupportAPI
JWT:ExpirationMinutes = 60
```

### Refresh Token Configuration
```
RefreshTokens:DaysToExpire = 30
RefreshTokens:MaxActiveTokensPerUser = 5
```

### CORS Configuration
```
CORS:Origins:0 = http://localhost:3000
CORS:Origins:1 = http://localhost:3001
```

For production:
```
CORS:Origins:0 = https://your-dashboard.com
CORS:Origins:1 = https://your-widget-domain.com
```

### API Configuration
```
Api:BaseUrl = http://localhost:5000
Widget:Url = http://localhost:3001
```

### Features
```
Features:EmailNotifications = false
```

---

## 📋 Frontend - Dashboard (Next.js)

Create `frontend/apps/dashboard/.env.local`:

```bash
# API URL - Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
NODE_ENV=production
```

---

## 📋 Frontend - Widget (Next.js)

Create `frontend/apps/widget/.env.local`:

```bash
# API URL - Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000

# Widget URL
NEXT_PUBLIC_WIDGET_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_WIDGET_URL=https://your-widget-domain.com
NODE_ENV=production
```

---

## 🚀 Quick Setup Commands

### Option 1: .NET User Secrets (Recommended)

```powershell
# Run the automated setup script
.\setup-dotnet-secrets.ps1

# Or manually:
cd backend/src/CustomerSupport.Api
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GEMINI_API_KEY"
dotnet user-secrets set "JWT:Secret" "YOUR_JWT_SECRET"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=127.0.0.1;Database=customersupport;Username=postgres;Password=YOUR_PASSWORD;Port=5432;SSL Mode=Disable;Timeout=30;"
```

### Option 2: .env Files

```powershell
# Run the automated setup script
.\setup-dotenv.ps1

# Or manually create .env files in each location
```

---

## 🔒 Security Notes

### ❌ NEVER commit these to git:
- `.env`
- `.env.local`
- `.env.production`
- `appsettings.json` (with real secrets)
- Any file containing actual API keys or passwords

### ✅ SAFE to commit:
- `.env.example`
- `.env.template`
- `appsettings.Example.json`
- This documentation file

### 🛡️ Already protected in .gitignore:
```
**/.env
**/.env.*
!**/.env.example
**/appsettings.json
!**/appsettings.Example.json
```

---

## 📝 Current Known Values (from your setup)

### Database
- Host: `127.0.0.1`
- Port: `5432`
- Database: `customersupport`
- Username: `postgres`
- Password: `postgres` (⚠️ change for production!)

### Redis
- Connection: `localhost:6379`

### JWT
- Issuer: `CustomerSupportAgent`
- Audience: `CustomerSupportAPI`
- Expiration: `60` minutes

### CORS Origins (Development)
- Dashboard: `http://localhost:3000`
- Widget: `http://localhost:3001`

### API Endpoints (Development)
- Backend: `http://localhost:5000`
- Dashboard: `http://localhost:3000`
- Widget: `http://localhost:3001`

### Gemini AI
- Model: `gemini-3-flash`
- Max Tokens: `2048`
- Temperature: `0.7`

---

## 🎯 What You Need to Fill In

### Required (Application won't work without these):
1. **Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **JWT Secret** - Generate a strong random string (at least 64 characters)
3. **Database Password** - Your PostgreSQL password

### Optional (Has defaults):
- Redis connection (defaults to `localhost:6379`)
- CORS origins (defaults shown above)
- Gemini model settings (defaults shown above)

---

## 🧪 Testing Your Setup

After setting up your environment variables:

```powershell
# Test backend
cd backend/src/CustomerSupport.Api
dotnet run
# Should start on http://localhost:5000

# Test dashboard
cd frontend/apps/dashboard
npm run dev
# Should start on http://localhost:3000

# Test widget
cd frontend/apps/widget
npm run dev
# Should start on http://localhost:3001
```

---

## 📚 Related Files

- `DOTNET_SECRET_MANAGEMENT.md` - Detailed guide on managing .NET secrets
- `SECRET_MANAGEMENT_GUIDE.md` - General secret management guide
- `setup-dotnet-secrets.ps1` - Automated User Secrets setup
- `setup-dotenv.ps1` - Automated .env file setup
- `check-secrets-status.bat` - Verify secrets aren't tracked by git

---

**Need help?** Run `.\verify-backend-widget-integration.ps1` to check your setup!

