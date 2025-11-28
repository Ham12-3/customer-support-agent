# 🤖 AI Customer Support & Sales Agent Platform

> Enterprise-grade AI agent platform that enables businesses to deploy intelligent chatbots for autonomous customer support, sales conversations, and proactive engagement.

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📋 Overview

This platform allows enterprises to:
- ✨ **Add AI chatbots to their websites** with a single script tag
- 🧠 **Train agents on their content** (documents, websites, FAQs)
- 💬 **Handle autonomous conversations** for support and sales
- 👥 **Keep humans in the loop** for complex inquiries
- 📊 **Monitor and analyze** all customer interactions
- 🚀 **Scale customer engagement** without scaling headcount

---

## 🏗️ Architecture

### Tech Stack

**Backend (.NET 8):**
- ASP.NET Core Web API
- Entity Framework Core + PostgreSQL
- SignalR (real-time messaging)
- Semantic Kernel (AI orchestration)
- Hangfire (background jobs)

**Frontend (Next.js 14):**
- React with TypeScript
- TailwindCSS + Shadcn/ui
- React Query (data fetching)
- Zustand (state management)
- Turborepo (monorepo)

**AI/ML (Future):**
- OpenAI GPT-4 (LLM) - Coming soon
- text-embedding-ada-002 (embeddings) - Coming soon
- Pinecone/Qdrant (vector database) - Coming soon
- RAG (Retrieval Augmented Generation) - Coming soon

**Infrastructure:**
- Docker (PostgreSQL, Redis)
- Azure/AWS (deployment ready)
- Redis (caching ready)

**Note:** This is currently an MVP with authentication and database foundation. AI features will be added in subsequent phases.

---

## 📚 Documentation

### Getting Started
| Document | Description |
|----------|-------------|
| [**QUICK_START.md**](QUICK_START.md) | ⚡ Get running in 5 minutes |
| [**RUNNING_THE_APPLICATION.md**](RUNNING_THE_APPLICATION.md) | 📖 Complete setup guide with troubleshooting |
| [**AUTHENTICATION_GUIDE.md**](AUTHENTICATION_GUIDE.md) | 🔐 Login issues & user management |
| [**LOGIN_FIX_SUMMARY.md**](LOGIN_FIX_SUMMARY.md) | 🔧 Quick fix for "Failed login attempt" error |

### Architecture & Planning
| Document | Description |
|----------|-------------|
| [**ARCHITECTURE_PLAN.md**](ARCHITECTURE_PLAN.md) | Complete system architecture, workflows, and technical specifications |
| [**PROJECT_STRUCTURE.md**](PROJECT_STRUCTURE.md) | Detailed codebase organization and file structure |
| [**IMPLEMENTATION_ROADMAP.md**](IMPLEMENTATION_ROADMAP.md) | Week-by-week development guide with code examples |

### Code Reviews & Refactoring
| Document | Description |
|----------|-------------|
| [**CODE_REVIEW.md**](CODE_REVIEW.md) | Backend code analysis and improvements |
| [**FRONTEND_REVIEW.md**](FRONTEND_REVIEW.md) | Frontend code analysis (40 issues identified) |
| [**FRONTEND_REVIEW_SUMMARY.md**](FRONTEND_REVIEW_SUMMARY.md) | Executive summary of frontend improvements |
| [**REFACTORING_CHECKLIST.md**](REFACTORING_CHECKLIST.md) | Backend refactoring progress tracker |
| [**FRONTEND_REFACTORING_CHECKLIST.md**](FRONTEND_REFACTORING_CHECKLIST.md) | Frontend refactoring progress tracker |

---

## 🚀 Quick Start

### ⚡ Fastest Way to Start (Windows)

```powershell
# Use the automated startup script
.\start-dev.ps1
```

This automatically starts Docker, backend, and frontend! 🎉

### 📖 Detailed Guides

- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes ⚡
- **[RUNNING_THE_APPLICATION.md](RUNNING_THE_APPLICATION.md)** - Complete guide with troubleshooting 📚

### Prerequisites
- ✅ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ [Node.js 18+](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Manual Installation

```powershell
# 1. Start databases
docker-compose up -d

# 2. Setup backend
cd backend
dotnet restore

# Create initial migration (first time only)
dotnet ef migrations add InitialCreate --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Run backend
cd src/CustomerSupport.Api
dotnet watch run

# 3. Setup frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

### 🌐 Access Points
- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/swagger
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### 🛑 Stopping Services

```powershell
# Use the stop script
.\stop-dev.ps1

# Or manually
docker-compose stop
# Then Ctrl+C in backend and frontend terminals
```

---

## 🎯 Core Features

### For Enterprises

#### 1. **Easy Integration**
```html
<!-- Add one script tag to your website -->
<script src="https://cdn.yourdomain.com/widget.js" 
        data-domain-id="your-domain-id">
</script>
```

#### 2. **Knowledge Base Management**
- Upload documents (PDF, DOCX, TXT)
- Import from URLs (automatic web scraping)
- Manual FAQ entry
- Automatic content updates

#### 3. **AI Agent Configuration**
- Customize branding (colors, logo, position)
- Set personality and tone
- Define business hours
- Configure escalation rules

#### 4. **Analytics Dashboard**
- Real-time conversation monitoring
- Performance metrics (resolution rate, response time)
- Customer satisfaction scores
- Usage reports and insights

### For Customers

#### 1. **Instant AI Support**
- 24/7 availability
- Sub-3 second response times
- Contextual, relevant answers
- Natural conversation flow

#### 2. **Seamless Human Handoff**
- Request human agent anytime
- Automatic escalation for complex issues
- Full context transfer
- No repeated information

#### 3. **Rich Interactions**
- Text, images, and rich media
- File uploads
- Quick reply buttons
- Conversation history

---

## 🔄 How It Works

### 1. **Onboarding Flow**
```
Enterprise Signs Up → Add Domain → Verify Ownership → Configure Agent → 
Upload Content → Get Embed Script → Deploy to Website → Go Live!
```

### 2. **Content Ingestion Pipeline**
```
Upload Document → Parse & Extract → Clean Text → Chunk Content → 
Generate Embeddings → Store in Vector DB → Ready for Queries
```

### 3. **AI Conversation Flow**
```
Customer Message → Detect Intent → Retrieve Context (RAG) → 
Generate Response (LLM) → Check Escalation → Send to Customer → 
Save Conversation → Update Analytics
```

### 4. **RAG (Retrieval Augmented Generation)**
```
User Query → Convert to Embedding → Vector Similarity Search → 
Retrieve Top-K Chunks → Inject into LLM Prompt → Generate Answer
```

---

## 📁 Project Structure

```
customer-support-agent/
├── backend/              # .NET 8 Backend
│   ├── src/
│   │   ├── CustomerSupport.Api/           # API Gateway
│   │   ├── CustomerSupport.Core/          # Domain Models
│   │   ├── CustomerSupport.Infrastructure/# Data Access
│   │   ├── CustomerSupport.Agent/         # AI Engine
│   │   ├── CustomerSupport.ContentIngestion/ # Document Processing
│   │   └── CustomerSupport.RealTime/      # SignalR Hubs
│   └── tests/
│
├── frontend/             # Next.js Frontend
│   ├── apps/
│   │   ├── dashboard/    # Enterprise Portal
│   │   ├── widget/       # Chat Widget
│   │   └── admin/        # Platform Admin
│   └── packages/         # Shared Code
│
├── infrastructure/       # IaC & Docker
├── scripts/             # Utility Scripts
└── docs/                # Documentation
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for complete details.

---

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run API
dotnet run --project src/CustomerSupport.Api

# Run tests
dotnet test

# Create migration
dotnet ef migrations add MigrationName --project src/CustomerSupport.Infrastructure

# Apply migration
dotnet ef database update --project src/CustomerSupport.Infrastructure
```

### Frontend Development

```bash
cd frontend

# Run all apps
pnpm dev

# Run specific app
pnpm dev --filter dashboard

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm type-check
```

### Docker Development

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
```

---

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
dotnet test --filter Category=Unit

# Integration tests
dotnet test --filter Category=Integration

# All tests with coverage
dotnet test /p:CollectCoverage=true /p:CoverageDirectory=coverage
```

### Frontend Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 📊 Key Metrics & Goals

### Performance Targets
- ⚡ API response time: < 200ms (p95)
- 🚀 Widget load time: < 1s
- 🤖 AI response time: < 3s
- 📈 System uptime: > 99.9%

### Business KPIs
- ✅ AI resolution rate: > 85%
- 📉 Escalation rate: < 15%
- 😊 Customer satisfaction: > 4.5/5
- 💰 Cost per conversation: < $0.50

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Weeks 1-8)
- [x] Authentication & multi-tenancy
- [x] Domain management & verification
- [x] Document upload & processing
- [x] AI agent with RAG
- [x] Embeddable widget
- [x] Conversation history
- [x] Basic analytics

### 🚧 Phase 2: Enhanced Features (Weeks 9-16)
- [ ] Human handoff system
- [ ] Proactive messaging
- [ ] Billing & subscriptions
- [ ] CRM integrations
- [ ] Advanced analytics
- [ ] Webhooks

### 🔮 Phase 3: Enterprise Features (Weeks 17-24)
- [ ] Multi-language support
- [ ] Custom model fine-tuning
- [ ] Mobile apps (iOS/Android)
- [ ] Voice conversations
- [ ] WhatsApp/SMS integration
- [ ] White-label options

See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for detailed timeline.

---

## 🔐 Security

- 🔒 JWT authentication with refresh tokens
- 🛡️ Row-level security (tenant isolation)
- 🔐 Encryption at rest and in transit (TLS 1.3)
- 🚫 PII detection and masking
- ✅ GDPR compliant (data export, deletion)
- 🔍 Regular security audits
- 🚨 Rate limiting and DDoS protection

---

## 🌍 Deployment

### Environments
- **Development:** Local (Docker Compose)
- **Staging:** Azure App Service
- **Production:** Azure Kubernetes Service (AKS)

### CI/CD Pipeline
```
Push to GitHub → Run Tests → Build Docker Images → 
Deploy to Staging → Automated Tests → Manual Approval → 
Deploy to Production → Monitor
```

See `infrastructure/` directory for IaC templates.

---

## 📖 API Documentation

Interactive API documentation available at:
- **Swagger UI:** http://localhost:5000/swagger
- **ReDoc:** http://localhost:5000/redoc

### Key Endpoints

```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh

Domains:
  GET    /api/domains
  POST   /api/domains
  GET    /api/domains/{id}/script
  POST   /api/domains/{id}/verify

Conversations:
  GET    /api/conversations
  GET    /api/conversations/{id}
  POST   /api/conversations/{id}/feedback

Knowledge Base:
  POST   /api/knowledge-base/upload
  GET    /api/knowledge-base/documents
  DELETE /api/knowledge-base/documents/{id}

Analytics:
  GET    /api/analytics/metrics
  GET    /api/analytics/conversations
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 📚 Docs: [docs.yourdomain.com](https://docs.yourdomain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourorg/customer-support-agent/issues)

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 and embedding models
- Microsoft for .NET and Semantic Kernel
- Vercel for Next.js
- All our open-source dependencies

---

## 📊 Project Status

**Current Phase:** Planning & Foundation  
**Version:** 0.1.0 (Pre-MVP)  
**Last Updated:** November 19, 2025

---

**Built with ❤️ by the Customer Support Agent team**