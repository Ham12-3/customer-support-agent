# 🚀 Complete Application Guide - Customer Support Agent Platform

## 📖 What Is This Application?

This is an **Enterprise AI Customer Support & Sales Agent Platform** - think of it as your own version of **Intercom**, **Zendesk Chat**, or **Drift**, but with AI-powered responses and full control over the platform.

---

## 🎯 The Big Picture

### What It Does:
**Allows businesses to add AI chatbots to their websites** that can:
- Answer customer questions automatically
- Learn from company documents and knowledge base
- Handle support conversations 24/7
- Escalate to human agents when needed
- Track and analyze all conversations

### Who Uses It:
1. **Businesses (Your Customers):**
   - Sign up → Add their website → Upload content → Get embed code → Deploy widget
   
2. **End Users (Their Customers):**
   - Visit business website → See chat widget → Ask questions → Get AI responses

---

## 🏗️ Application Structure

### Three Main Applications:

#### 1. **Dashboard App** (Port 3000)
**URL:** http://localhost:3000

**What it is:** Enterprise admin portal where businesses manage their AI agent

**Features:**
- ✅ User authentication (login/register)
- ✅ Domain management (add/verify websites)
- ✅ Knowledge base (upload documents)
- ✅ Conversation viewing
- ✅ Analytics dashboard
- ✅ Settings and profile management

**Who uses it:** Business owners, support managers, admins

#### 2. **Widget App** (Port 3001)
**URL:** http://localhost:3001

**What it is:** Embeddable chat widget that appears on customer websites

**Features:**
- ✅ Chat interface
- ✅ AI-powered responses
- ✅ Session management
- ✅ Responsive design
- ✅ Customizable (future)

**Who uses it:** End customers visiting business websites

#### 3. **Backend API** (Port 5000)
**URL:** http://localhost:5000

**What it is:** Server that handles all business logic, data storage, and AI processing

**Features:**
- ✅ RESTful API endpoints
- ✅ Database management
- ✅ Authentication & authorization
- ✅ AI integration (Gemini)
- ✅ Real-time capabilities (SignalR ready)

---

## 🔄 How It Works - Complete Flow

### Step 1: Business Signs Up
```
Business Owner → Dashboard → Register → Create Account
```
- Creates company/tenant
- Sets up admin user
- Gets access to dashboard

### Step 2: Add Domain
```
Dashboard → Domains → Add Domain → Enter Website URL
```
- System generates API key
- Creates verification code
- Domain status: Pending

### Step 3: Verify Domain
```
Dashboard → Domains → Verify → Add Meta Tag to Website
```
- Business adds verification code to their website
- System checks and verifies ownership
- Domain status: Active

### Step 4: Upload Knowledge Base
```
Dashboard → Knowledge Base → Upload Documents
```
- Upload PDFs, DOCX, text files
- Or import from URLs
- Content gets processed and stored

### Step 5: Get Embed Code
```
Dashboard → Domains → Copy Embed Script
```
- System generates JavaScript code
- Contains API key and configuration
- Ready to paste into website

### Step 6: Deploy Widget
```
Business Website → Add Script Tag → Widget Appears
```
- Widget loads on customer website
- Appears as chat button (bottom-right)
- Ready to receive customer messages

### Step 7: Customer Uses Widget
```
Customer → Clicks Chat → Types Question → Gets AI Response
```
- Customer asks question
- Widget sends to backend API
- AI processes using knowledge base
- Response sent back to customer
- Conversation saved in database

### Step 8: Business Monitors
```
Dashboard → Conversations → View All Chats
```
- See all customer conversations
- View messages and responses
- Analyze performance
- Check analytics

---

## 🗄️ Database Structure

### Core Entities:

**Tenant (Company)**
- Represents a business/organization
- Has multiple users, domains, conversations
- Isolated data (multi-tenant)

**User**
- Admin users who manage the platform
- Belongs to a tenant
- Has roles (Admin, Agent, Viewer)

**Domain**
- Website where widget is deployed
- Has API key for authentication
- Verification status
- Widget configuration

**Conversation**
- Chat session between customer and AI
- Belongs to a domain and tenant
- Has status (Active, Resolved, Escalated)
- Contains multiple messages

**Message**
- Individual chat message
- Belongs to a conversation
- Has role (User, Assistant)
- Contains content and timestamp

**Document**
- Knowledge base file
- Belongs to a tenant
- Has processing status
- Contains chunks for AI retrieval

---

## 🔐 Security & Authentication

### Authentication Flow:
1. User registers/logs in
2. Backend generates JWT access token + refresh token
3. Frontend stores tokens
4. All API requests include token in header
5. Backend validates token
6. Token expires → Use refresh token to get new one

### Multi-Tenancy:
- Each tenant's data is completely isolated
- All queries filtered by tenant ID
- Users can only access their tenant's data
- API keys are tenant-specific

---

## 🎨 User Interface

### Dashboard Design:
- **Luxury/Modern Theme** - Dark background, glassmorphism effects
- **Responsive** - Works on desktop, tablet, mobile
- **Animated** - Smooth transitions and loading states
- **Intuitive** - Clear navigation and user flows

### Widget Design:
- **Minimal** - Small chat button, expands to window
- **Customizable** - Colors, position, branding (future)
- **Fast** - Lightweight, quick loading
- **Accessible** - Works with screen readers

---

## 📊 Current Features Status

### ✅ Fully Implemented:
- User authentication (register, login, refresh tokens)
- Multi-tenant architecture
- Domain management (add, verify, delete)
- Knowledge base (upload documents)
- Conversation viewing
- Dashboard with analytics
- Widget chat interface
- AI integration (Gemini API)
- API endpoints structure
- Database models and migrations

### 🔄 Partially Implemented:
- AI responses (basic, needs RAG enhancement)
- Real-time chat (SignalR ready, not connected)
- Document processing (upload works, chunking coming)

### 📅 Planned:
- RAG (Retrieval Augmented Generation)
- Vector database integration
- Human handoff system
- Advanced analytics
- Billing system
- Multi-language support

---

## 🛠️ Technology Stack

### Backend:
- **.NET 8** - Modern C# framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching (ready)
- **JWT** - Authentication
- **Gemini AI** - AI responses
- **SignalR** - Real-time (ready)

### Frontend:
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Infrastructure:
- **Docker** - Containerization
- **Docker Compose** - Local development
- **PostgreSQL** - Database
- **Redis** - Cache

---

## 📁 Project Organization

```
customer-support-agent/
├── backend/              # .NET Backend
│   ├── src/
│   │   ├── CustomerSupport.Api/        # API Controllers
│   │   ├── CustomerSupport.Core/       # Domain Models
│   │   └── CustomerSupport.Infrastructure/  # Data Access
│   └── tests/
│
├── frontend/             # Next.js Frontend
│   ├── apps/
│   │   ├── dashboard/    # Admin Portal (Port 3000)
│   │   └── widget/       # Chat Widget (Port 3001)
│   └── packages/        # Shared code (future)
│
├── docker-compose.yml    # Database services
└── docs/                 # Documentation
```

---

## 🎯 Key Features Explained

### 1. Multi-Tenancy
**What it means:** Each business has completely isolated data
- Business A can't see Business B's data
- All queries automatically filtered by tenant
- Secure and scalable

### 2. Domain Verification
**What it means:** Businesses must prove they own the website
- Prevents unauthorized widget deployment
- Security measure
- Uses meta tag verification

### 3. Knowledge Base
**What it means:** AI learns from uploaded documents
- Upload company docs, FAQs, manuals
- AI uses this to answer questions
- RAG (coming soon) will make this smarter

### 4. Conversation Tracking
**What it means:** All chats are saved and viewable
- Businesses can review conversations
- Analytics and insights
- Quality assurance

### 5. API Key Authentication
**What it means:** Widget authenticates with unique key
- Each domain has its own API key
- Secure communication
- Prevents unauthorized access

---

## 🚀 Getting Started (Quick Summary)

### 1. Start Databases
```powershell
docker-compose up -d
```

### 2. Start Backend
```powershell
cd backend\src\CustomerSupport.Api
dotnet run
```

### 3. Start Frontend
```powershell
cd frontend
pnpm dev
```

### 4. Access Applications
- Dashboard: http://localhost:3000
- Widget: http://localhost:3001
- API Docs: http://localhost:5000/swagger

---

## 📈 Use Cases

### E-commerce:
- Product questions
- Order tracking
- Returns/exchanges
- Shipping information

### SaaS:
- Technical support
- Feature explanations
- Account management
- Billing questions

### Service Business:
- Appointment scheduling
- Service information
- Pricing questions
- Contact information

---

## 🎓 Learning the Codebase

### Start Here:
1. **README.md** - Main overview
2. **QUICK_START.md** - Get running fast
3. **PROJECT_STRUCTURE.md** - Understand file organization
4. **ARCHITECTURE_PLAN.md** - System design details

### Key Files to Understand:
- `backend/src/CustomerSupport.Api/Program.cs` - Backend setup
- `frontend/apps/dashboard/src/app/dashboard/page.tsx` - Dashboard homepage
- `frontend/apps/widget/src/app/page.tsx` - Widget chat interface
- `backend/src/CustomerSupport.Api/Controllers/ChatController.cs` - Chat API

---

## 💡 What Makes This Special

1. **Complete Platform** - Not just a widget, full management system
2. **Multi-Tenant** - Enterprise-ready architecture
3. **Extensible** - Easy to add features
4. **Modern Stack** - Latest technologies
5. **Well Documented** - Extensive guides and docs
6. **Production Ready** - Security, error handling, scalability

---

## 🔮 Future Vision

This platform can become:
- **White-label solution** - Agencies can resell
- **Marketplace** - Pre-built AI agents for industries
- **Enterprise SaaS** - Large-scale deployment
- **API Platform** - Developers can build on top

---

## ✅ Summary

**This is a complete, enterprise-grade platform for deploying AI chatbots.**

**Think of it as:**
- **Intercom** (chat widget) + 
- **Zendesk** (support management) + 
- **ChatGPT** (AI responses) + 
- **Custom Platform** (full control)

**All in one solution!** 🚀

---

**Want to know more about a specific part? Just ask!** 💬

