# Customer Support Agent - Backend

This is the .NET 8 backend API for the AI Customer Support & Sales Agent Platform.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── CustomerSupport.Api/           # Main Web API project
│   ├── CustomerSupport.Core/          # Domain entities & interfaces
│   ├── CustomerSupport.Infrastructure/# Data access & external services
│   └── CustomerSupport.Agent/         # AI agent logic (future)
└── tests/
    └── CustomerSupport.Tests/         # Unit & integration tests
```

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL 16](https://www.postgresql.org/) (or use Docker)
- [Redis 7](https://redis.io/) (optional, or use Docker)

### Setup

1. **Start the database services:**

```bash
# From project root
docker-compose up -d postgres redis
```

2. **Restore NuGet packages:**

```bash
cd backend
dotnet restore
```

3. **Update the database:**

```bash
# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create and apply migrations
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
```

4. **Run the API:**

```bash
dotnet run --project src/CustomerSupport.Api
```

The API will be available at:
- HTTP: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

## 🔧 Development

### Building

```bash
# Build all projects
dotnet build

# Build specific project
dotnet build src/CustomerSupport.Api
```

### Running Tests

```bash
# Run all tests
dotnet test

# Run with code coverage
dotnet test /p:CollectCoverage=true
```

### Database Migrations

```bash
# Add a new migration
dotnet ef migrations add MigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Apply migrations
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Rollback to specific migration
dotnet ef database update PreviousMigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Remove last migration (if not applied)
dotnet ef migrations remove --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Generate SQL script
dotnet ef migrations script --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api --output migration.sql
```

## 📝 Configuration

Configuration is managed through `appsettings.json` and environment variables.

### Connection Strings

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=customersupport;Username=postgres;Password=postgres",
    "Redis": "localhost:6379"
  }
}
```

### JWT Settings

```json
{
  "JWT": {
    "Secret": "YourSecretKeyHere",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": "60"
  }
}
```

⚠️ **Important:** Never commit production secrets to source control. Use environment variables or Azure Key Vault in production.

## 🧪 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Health Check

- `GET /health` - API health status

See Swagger documentation for complete API reference: `http://localhost:5000/swagger`

## 📦 Key Dependencies

- **Microsoft.EntityFrameworkCore** - ORM
- **Npgsql.EntityFrameworkCore.PostgreSQL** - PostgreSQL provider
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT auth
- **BCrypt.Net-Next** - Password hashing
- **Serilog** - Structured logging
- **Swashbuckle.AspNetCore** - Swagger/OpenAPI

## 🏛️ Architecture

### Clean Architecture Layers

1. **Core** - Domain entities, interfaces, DTOs
   - No external dependencies
   - Pure business logic

2. **Infrastructure** - Data access, external services
   - Implements Core interfaces
   - EF Core, repositories, services

3. **API** - HTTP endpoints, controllers
   - Entry point
   - Authentication, routing, middleware

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - IoC container
- **DTOs** - Separate API contracts from domain models
- **SOLID Principles** - Clean, maintainable code

## 🔒 Security

- JWT token authentication
- Password hashing with BCrypt
- CORS configuration
- Input validation
- SQL injection prevention (EF Core parameterized queries)

## 📊 Logging

Logs are written to:
- Console (Development)
- Files in `logs/` directory
- Can be configured for Application Insights, Seq, etc.

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t customer-support-backend -f infrastructure/docker/backend.Dockerfile .

# Run container
docker run -p 5000:8080 customer-support-backend
```

### Production Checklist

- [ ] Update JWT secret (use strong random value)
- [ ] Configure production database
- [ ] Set up SSL/TLS
- [ ] Enable Application Insights
- [ ] Configure CORS for production domains
- [ ] Set up CI/CD pipeline
- [ ] Enable health checks
- [ ] Configure rate limiting
- [ ] Set up backup strategy

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run tests and linting
5. Create a pull request

## 📄 License

MIT License - see LICENSE file for details

