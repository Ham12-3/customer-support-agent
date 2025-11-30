# .NET Secret Management Guide

## 🔒 Managing API Keys & Secrets in .NET

Your Gemini API key and other sensitive data should **NEVER** be hardcoded in `appsettings.json`. Here are two recommended approaches:

---

## ✅ Option 1: User Secrets (Recommended) ⭐

### Why Use User Secrets?
- **Native to .NET** - No extra packages needed
- **Secure** - Stored outside your project directory
- **Simple** - Built-in CLI commands
- **Best Practice** - Microsoft's recommended approach for development

### How to Set Up

**Step 1: Initialize User Secrets**
```powershell
cd backend/src/CustomerSupport.Api
dotnet user-secrets init
```

This adds a `UserSecretsId` to your `.csproj` file.

**Step 2: Add Your Gemini API Key**
```powershell
dotnet user-secrets set "Gemini:ApiKey" "YOUR_ACTUAL_GEMINI_API_KEY"
```

**Step 3: Add JWT Secret**
```powershell
dotnet user-secrets set "JWT:Secret" "YOUR_STRONG_JWT_SECRET_AT_LEAST_64_CHARS"
```

**Step 4: Add Database Password**
```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=127.0.0.1;Database=customersupport;Username=postgres;Password=YOUR_PASSWORD;Port=5432;SSL Mode=Disable;Timeout=30;"
```

### Automated Setup
Run the PowerShell script:
```powershell
.\setup-dotnet-secrets.ps1
```

### Where Are Secrets Stored?

**Windows**: `%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json`  
**Mac/Linux**: `~/.microsoft/usersecrets/<user_secrets_id>/secrets.json`

### Useful Commands

```powershell
# List all secrets
dotnet user-secrets list

# Remove a specific secret
dotnet user-secrets remove "Gemini:ApiKey"

# Clear all secrets
dotnet user-secrets clear
```

### How It Works
- User secrets **override** `appsettings.json` values
- They're automatically loaded in **Development** environment
- They're **NOT checked into git** (stored outside project)
- **NO code changes needed** - it just works!

---

## ✅ Option 2: .env File (Node.js Style)

### Why Use .env Files?
- **Familiar** - Same approach as Node.js/React projects
- **Portable** - Easy to share template with team
- **Explicit** - All config in one visible file

### How to Set Up

**Step 1: Install DotNetEnv Package**
```powershell
cd backend/src/CustomerSupport.Api
dotnet add package DotNetEnv
```

**Step 2: Create .env File**
Create `backend/.env` (copy from `backend/.env.example`):

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=customersupport
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_jwt_secret_here
JWT_ISSUER=CustomerSupportAgent
JWT_AUDIENCE=CustomerSupportAPI
JWT_EXPIRATION_MINUTES=60

# Redis
REDIS_CONNECTION=localhost:6379

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Step 3: Load .env in Program.cs**

Add at the **very beginning** of `Program.cs`:

```csharp
using DotNetEnv; // Add this at top

// Add this before var builder = WebApplication.CreateBuilder(args);
Env.Load("../../.env"); // Load .env file

var builder = WebApplication.CreateBuilder(args);
```

**Step 4: Update appsettings.json to Use Environment Variables**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=${DB_HOST};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD};Port=${DB_PORT};SSL Mode=Disable;Timeout=30;",
    "Redis": "${REDIS_CONNECTION}"
  },
  "JWT": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "${JWT_ISSUER}",
    "Audience": "${JWT_AUDIENCE}",
    "ExpirationMinutes": "${JWT_EXPIRATION_MINUTES}"
  },
  "Gemini": {
    "ApiKey": "${GEMINI_API_KEY}",
    "Model": "${GEMINI_MODEL}"
  }
}
```

**Step 5: Ensure .env is in .gitignore**

Add to `.gitignore`:
```
.env
backend/.env
```

### Automated Setup
Run the PowerShell script:
```powershell
.\setup-dotenv.ps1
```

---

## 🆚 Comparison

| Feature | User Secrets | .env File |
|---------|--------------|-----------|
| **Native to .NET** | ✅ Yes | ❌ Needs package |
| **Setup Complexity** | ⭐ Very Easy | ⭐⭐ Easy |
| **Visibility** | Hidden in system | Visible in project |
| **Team Sharing** | Share commands | Share .env.example |
| **Production Ready** | ❌ Dev only | ✅ Can use in prod |
| **Git Safety** | ✅ Never in git | ⚠️ Must add to .gitignore |
| **Microsoft Recommended** | ✅ Yes | ❌ No |

---

## 🚀 Recommended Approach

### For Development (Local)
**Use User Secrets** ⭐
- Easiest and safest
- No risk of accidentally committing secrets
- No code changes needed

### For Production (Deployment)
**Use Environment Variables**
- Set in your hosting platform (Azure, AWS, Docker, etc.)
- Same configuration keys as User Secrets
- Most secure for production

---

## 🔧 Current Status in Your Project

### ⚠️ Current Issues

Your `appsettings.json` currently contains **hardcoded secrets**:

```json
{
  "Gemini": {
    "ApiKey": "YOUR_ACTUAL_API_KEY_HERE",  // ⚠️ EXPOSED!
  },
  "JWT": {
    "Secret": "YOUR_ACTUAL_JWT_SECRET",  // ⚠️ EXPOSED!
  },
  "ConnectionStrings": {
    "DefaultConnection": "...Password=YOUR_PASSWORD..."  // ⚠️ EXPOSED!
  }
}
```

### ✅ How to Fix

**Option A: Quick Fix with User Secrets (Recommended)**
```powershell
# Run the setup script
.\setup-dotnet-secrets.ps1

# Then clean appsettings.json to remove hardcoded values
# Replace actual values with placeholders
```

**Option B: Use .env Files**
```powershell
# Run the setup script
.\setup-dotenv.ps1

# Install package
cd backend/src/CustomerSupport.Api
dotnet add package DotNetEnv

# Update Program.cs to load .env
```

---

## 📝 Step-by-Step: Migrate to User Secrets (RECOMMENDED)

### 1. Run Setup Script
```powershell
.\setup-dotnet-secrets.ps1
```

This will:
- Initialize user secrets
- Copy your existing keys from `appsettings.json`
- Store them securely

### 2. Update appsettings.json

Replace sensitive values with safe placeholders:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=127.0.0.1;Database=customersupport;Username=postgres;Password=REPLACE_WITH_USER_SECRET;Port=5432;SSL Mode=Disable;Timeout=30;"
  },
  "JWT": {
    "Secret": "REPLACE_WITH_USER_SECRET",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": "60"
  },
  "Gemini": {
    "ApiKey": "REPLACE_WITH_USER_SECRET",
    "Model": "gemini-3-flash",
    "MaxTokens": 2048,
    "Temperature": 0.7
  }
}
```

### 3. Test It
```powershell
cd backend/src/CustomerSupport.Api
dotnet run
```

It should work exactly as before, but now your secrets are secure! 🔒

### 4. Commit Safe Version
```powershell
git add backend/src/CustomerSupport.Api/appsettings.json
git commit -m "Remove hardcoded secrets from appsettings.json"
```

---

## 🎯 Production Deployment

For production, use **Environment Variables**:

### Azure App Service
```bash
az webapp config appsettings set --resource-group <group> --name <app> \
  --settings Gemini__ApiKey=<your-key> \
  JWT__Secret=<your-secret>
```

### Docker
```dockerfile
ENV Gemini__ApiKey="your-key-here"
ENV JWT__Secret="your-secret-here"
```

### Docker Compose
```yaml
environment:
  - Gemini__ApiKey=${GEMINI_API_KEY}
  - JWT__Secret=${JWT_SECRET}
```

Note: Use double underscores `__` instead of `:` in environment variable names!

---

## 🛠️ Troubleshooting

### "Configuration value not found"
- Ensure user secrets are initialized: `dotnet user-secrets init`
- Check secrets exist: `dotnet user-secrets list`
- Verify you're in Development environment

### ".env file not loading"
- Check DotNetEnv package is installed
- Verify `Env.Load()` is at the top of Program.cs
- Ensure .env path is correct relative to the API project

### "Still seeing old values"
- Restart the backend application
- User secrets override appsettings.json
- Check you're running in Development mode

---

## 📚 Resources

- [Microsoft Docs: Safe Storage of App Secrets](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [DotNetEnv Package](https://github.com/tonerdo/dotnet-env)
- [Environment Variables in .NET](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)

---

## ✅ Next Steps

1. **Choose your approach**: User Secrets (recommended) or .env files
2. **Run the setup script**: `.\setup-dotnet-secrets.ps1` or `.\setup-dotenv.ps1`
3. **Clean appsettings.json**: Remove hardcoded secrets
4. **Test your application**: Ensure it still works
5. **Commit the changes**: Now safe to push to GitHub!

---

**Remember**: The goal is to keep secrets OUT of version control while making development easy! 🔒✨

