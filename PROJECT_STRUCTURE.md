# Project Structure

## 📁 Repository Organization

```
customer-support-agent/
│
├── 📁 backend/                                 # .NET Backend
│   ├── src/
│   │   ├── CustomerSupport.Api/               # Main API Gateway
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   ├── Program.cs
│   │   │   └── appsettings.json
│   │   │
│   │   ├── CustomerSupport.Core/              # Domain Models & Interfaces
│   │   │   ├── Entities/
│   │   │   │   ├── Tenant.cs
│   │   │   │   ├── User.cs
│   │   │   │   ├── Domain.cs
│   │   │   │   ├── Conversation.cs
│   │   │   │   ├── Message.cs
│   │   │   │   └── KnowledgeBase.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── IRepository.cs
│   │   │   │   ├── IAIService.cs
│   │   │   │   └── IVectorStore.cs
│   │   │   ├── DTOs/
│   │   │   ├── Enums/
│   │   │   └── Constants/
│   │   │
│   │   ├── CustomerSupport.Infrastructure/    # Data Access & External Services
│   │   │   ├── Data/
│   │   │   │   ├── AppDbContext.cs
│   │   │   │   ├── Migrations/
│   │   │   │   └── Configurations/
│   │   │   ├── Repositories/
│   │   │   ├── Services/
│   │   │   │   ├── EmailService.cs
│   │   │   │   ├── CacheService.cs
│   │   │   │   └── BlobStorageService.cs
│   │   │   └── Integrations/
│   │   │       ├── OpenAI/
│   │   │       ├── Stripe/
│   │   │       └── SendGrid/
│   │   │
│   │   ├── CustomerSupport.Agent/             # AI Agent Service
│   │   │   ├── Services/
│   │   │   │   ├── AgentOrchestrator.cs
│   │   │   │   ├── RAGService.cs
│   │   │   │   ├── IntentDetector.cs
│   │   │   │   └── ResponseGenerator.cs
│   │   │   ├── Prompts/
│   │   │   ├── Memory/
│   │   │   └── Plugins/
│   │   │
│   │   ├── CustomerSupport.ContentIngestion/  # Content Processing
│   │   │   ├── Services/
│   │   │   │   ├── DocumentParser.cs
│   │   │   │   ├── WebScraper.cs
│   │   │   │   ├── TextChunker.cs
│   │   │   │   └── EmbeddingService.cs
│   │   │   ├── Jobs/
│   │   │   └── Parsers/
│   │   │       ├── PdfParser.cs
│   │   │       ├── DocxParser.cs
│   │   │       └── HtmlParser.cs
│   │   │
│   │   ├── CustomerSupport.RealTime/          # SignalR Hubs
│   │   │   ├── Hubs/
│   │   │   │   ├── ChatHub.cs
│   │   │   │   ├── AgentHub.cs
│   │   │   │   └── NotificationHub.cs
│   │   │   ├── Services/
│   │   │   └── Models/
│   │   │
│   │   ├── CustomerSupport.Analytics/         # Analytics Service
│   │   │   ├── Services/
│   │   │   │   ├── MetricsService.cs
│   │   │   │   ├── ReportGenerator.cs
│   │   │   │   └── InsightsEngine.cs
│   │   │   └── Models/
│   │   │
│   │   └── CustomerSupport.Shared/            # Shared Utilities
│   │       ├── Helpers/
│   │       ├── Extensions/
│   │       ├── Validators/
│   │       └── Exceptions/
│   │
│   ├── tests/
│   │   ├── CustomerSupport.UnitTests/
│   │   ├── CustomerSupport.IntegrationTests/
│   │   └── CustomerSupport.E2ETests/
│   │
│   ├── CustomerSupport.sln
│   ├── .editorconfig
│   └── Directory.Build.props
│
├── 📁 frontend/                                # Next.js Frontend
│   ├── apps/
│   │   ├── dashboard/                         # Enterprise Dashboard
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── overview/
│   │   │   │   │   ├── conversations/
│   │   │   │   │   ├── knowledge-base/
│   │   │   │   │   ├── agents/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   ├── domains/
│   │   │   │   │   │   ├── branding/
│   │   │   │   │   │   ├── team/
│   │   │   │   │   │   └── integrations/
│   │   │   │   │   └── billing/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/                        # Shadcn components
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   └── Stats.tsx
│   │   │   │   ├── conversations/
│   │   │   │   │   ├── ConversationList.tsx
│   │   │   │   │   ├── MessageThread.tsx
│   │   │   │   │   └── ConversationFilters.tsx
│   │   │   │   ├── knowledge-base/
│   │   │   │   │   ├── DocumentUpload.tsx
│   │   │   │   │   ├── UrlImporter.tsx
│   │   │   │   │   └── DocumentList.tsx
│   │   │   │   └── agents/
│   │   │   │       ├── AgentQueue.tsx
│   │   │   │       ├── LiveChat.tsx
│   │   │   │       └── AgentStatus.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   ├── signalr.ts
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useConversations.ts
│   │   │   │   └── useRealtime.ts
│   │   │   ├── store/
│   │   │   │   ├── authStore.ts
│   │   │   │   └── chatStore.ts
│   │   │   ├── types/
│   │   │   ├── next.config.js
│   │   │   ├── tsconfig.json
│   │   │   └── package.json
│   │   │
│   │   ├── widget/                            # Embeddable Chat Widget
│   │   │   ├── app/
│   │   │   │   ├── widget.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   ├── ChatBubble.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── ProactiveTrigger.tsx
│   │   │   ├── lib/
│   │   │   │   ├── widget-sdk.ts
│   │   │   │   ├── api-client.ts
│   │   │   │   └── storage.ts
│   │   │   ├── hooks/
│   │   │   ├── build-script.js              # Builds standalone widget
│   │   │   └── package.json
│   │   │
│   │   └── admin/                             # Platform Admin Portal
│   │       ├── app/
│   │       │   ├── tenants/
│   │       │   ├── users/
│   │       │   ├── monitoring/
│   │       │   └── settings/
│   │       ├── components/
│   │       └── package.json
│   │
│   ├── packages/                              # Shared packages (Turborepo)
│   │   ├── ui/                                # Shared UI components
│   │   │   ├── components/
│   │   │   └── package.json
│   │   ├── config/                            # Shared configs
│   │   │   ├── eslint/
│   │   │   ├── typescript/
│   │   │   └── tailwind/
│   │   └── types/                             # Shared TypeScript types
│   │       └── index.ts
│   │
│   ├── turbo.json
│   ├── package.json
│   └── pnpm-workspace.yaml
│
├── 📁 infrastructure/                          # Infrastructure as Code
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── networking/
│   │   │   ├── compute/
│   │   │   ├── database/
│   │   │   └── storage/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── production/
│   │   └── main.tf
│   │
│   ├── kubernetes/                            # K8s manifests (if using)
│   │   ├── backend/
│   │   ├── frontend/
│   │   └── ingress/
│   │
│   └── docker/
│       ├── backend.Dockerfile
│       ├── frontend.Dockerfile
│       └── docker-compose.yml
│
├── 📁 scripts/                                # Utility scripts
│   ├── setup-dev.sh
│   ├── seed-data.sh
│   ├── migrate-db.sh
│   └── deploy.sh
│
├── 📁 docs/                                   # Documentation
│   ├── api/                                   # API documentation
│   ├── architecture/                          # Architecture diagrams
│   ├── deployment/                            # Deployment guides
│   ├── development/                           # Development guides
│   └── user-guides/                           # End-user documentation
│
├── 📁 .github/                                # GitHub configs
│   ├── workflows/
│   │   ├── backend-ci.yml
│   │   ├── frontend-ci.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── .editorconfig
├── README.md
├── ARCHITECTURE_PLAN.md
├── PROJECT_STRUCTURE.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## 🗂️ Key Directory Purposes

### Backend Structure

#### **CustomerSupport.Api**
- Entry point for all HTTP requests
- JWT authentication middleware
- CORS configuration
- Swagger/OpenAPI documentation
- Global exception handling

#### **CustomerSupport.Core**
- Domain entities (POCOs)
- Business logic interfaces
- DTOs for API contracts
- Enums and constants
- No external dependencies (clean architecture)

#### **CustomerSupport.Infrastructure**
- Entity Framework Core DbContext
- Repository implementations
- External service integrations (OpenAI, Stripe, SendGrid)
- Caching with Redis
- Blob storage for documents

#### **CustomerSupport.Agent**
- AI orchestration with Semantic Kernel
- RAG pipeline implementation
- Prompt templates
- Conversation memory management
- Intent detection algorithms

#### **CustomerSupport.ContentIngestion**
- Document parsers (PDF, DOCX, HTML)
- Web scraping with HtmlAgilityPack
- Text chunking strategies
- Embedding generation
- Background job processing

#### **CustomerSupport.RealTime**
- SignalR hubs for real-time communication
- Connection management
- Message broadcasting
- Typing indicators
- Presence tracking

---

### Frontend Structure

#### **apps/dashboard** (Enterprise Portal)
- Full-featured admin interface
- Domain management
- Knowledge base configuration
- Conversation monitoring
- Analytics dashboards
- Team management
- Settings and integrations

#### **apps/widget** (Embeddable Chat)
- Lightweight, standalone chat widget
- Customizable branding
- Minimal dependencies
- Can be embedded via `<script>` tag
- Mobile-responsive

#### **apps/admin** (Platform Admin)
- Internal tool for platform team
- Tenant management
- System monitoring
- Feature flags
- Platform analytics

#### **packages/** (Shared Code)
- Reusable UI components
- Shared TypeScript types
- Common utilities
- Consistent configuration

---

## 🔧 Configuration Files

### Backend

#### **appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=customersupport;",
    "Redis": "localhost:6379"
  },
  "OpenAI": {
    "ApiKey": "",
    "Model": "gpt-4",
    "EmbeddingModel": "text-embedding-ada-002"
  },
  "VectorStore": {
    "Provider": "Pinecone",
    "ApiKey": "",
    "Environment": "us-west1-gcp"
  },
  "JWT": {
    "Secret": "",
    "Issuer": "CustomerSupportAgent",
    "Audience": "CustomerSupportAPI",
    "ExpirationMinutes": 60
  },
  "Stripe": {
    "SecretKey": "",
    "WebhookSecret": ""
  },
  "SendGrid": {
    "ApiKey": "",
    "FromEmail": "noreply@yourdomain.com"
  }
}
```

#### **Directory.Build.props**
```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <LangVersion>latest</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

### Frontend

#### **turbo.json**
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

#### **package.json** (root)
```json
{
  "name": "customer-support-agent",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🐳 Docker Setup

### **docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: customersupport
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: ../infrastructure/docker/backend.Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=customersupport;Username=postgres;Password=postgres
      - ConnectionStrings__Redis=redis:6379
    ports:
      - "5000:8080"
    depends_on:
      - postgres
      - redis

  dashboard:
    build:
      context: ./frontend
      dockerfile: ../infrastructure/docker/frontend.Dockerfile
      args:
        APP_NAME: dashboard
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend

  widget:
    build:
      context: ./frontend
      dockerfile: ../infrastructure/docker/frontend.Dockerfile
      args:
        APP_NAME: widget
    ports:
      - "3001:3000"

volumes:
  postgres_data:
  redis_data:
```

---

## 📋 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=Host=localhost;Database=customersupport;Username=postgres;Password=postgres
REDIS_URL=localhost:6379

# AI Services
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# Vector Store
VECTOR_STORE_PROVIDER=Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=customer-support

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ISSUER=CustomerSupportAgent
JWT_AUDIENCE=CustomerSupportAPI
JWT_EXPIRATION_MINUTES=60

# Payment (Optional for future billing features)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Optional - Not needed for MVP)
# SENDGRID_API_KEY=SG....
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Storage (For document uploads - future feature)
# AZURE_STORAGE_CONNECTION_STRING=...
# AZURE_STORAGE_CONTAINER=documents

# Monitoring
APPLICATION_INSIGHTS_KEY=...
SEQ_URL=http://localhost:5341
```

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SIGNALR_URL=http://localhost:5000/hubs

# Widget
NEXT_PUBLIC_WIDGET_URL=http://localhost:3001

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=auth.yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=...
```

---

## 🚀 Development Workflow

### Initial Setup
```bash
# Clone repository
git clone https://github.com/yourorg/customer-support-agent.git
cd customer-support-agent

# Start infrastructure
docker-compose up -d postgres redis

# Backend setup
cd backend
dotnet restore
dotnet ef database update --project src/CustomerSupport.Infrastructure
dotnet run --project src/CustomerSupport.Api

# Frontend setup
cd frontend
pnpm install
pnpm dev
```

### Running Tests
```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
pnpm test
```

### Database Migrations
```bash
# Create migration
dotnet ef migrations add MigrationName --project src/CustomerSupport.Infrastructure

# Apply migration
dotnet ef database update --project src/CustomerSupport.Infrastructure

# Revert migration
dotnet ef database update PreviousMigrationName --project src/CustomerSupport.Infrastructure
```

---

## 📦 Package Management

### Backend (NuGet)
Key packages:
- Microsoft.EntityFrameworkCore
- Microsoft.AspNetCore.SignalR
- Microsoft.SemanticKernel
- Hangfire
- FluentValidation
- AutoMapper
- Serilog

### Frontend (pnpm)
Key packages:
- next
- react
- typescript
- tailwindcss
- @microsoft/signalr
- @tanstack/react-query
- zustand
- zod
- react-hook-form

---

## 🎨 Code Style & Standards

### Backend (.editorconfig)
```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.cs]
csharp_new_line_before_open_brace = all
csharp_indent_case_contents = true
csharp_indent_switch_labels = true
```

### Frontend (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

---

This structure follows:
✅ **Clean Architecture** principles
✅ **Domain-Driven Design** patterns
✅ **Separation of Concerns**
✅ **Scalability** in mind
✅ **Testability** at every layer
✅ **Monorepo** approach for frontend (Turborepo)

Ready to start building! 🚀


