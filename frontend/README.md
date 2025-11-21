# Customer Support Agent - Frontend

This is the Next.js frontend monorepo for the AI Customer Support & Sales Agent Platform.

## 🏗️ Project Structure

```
frontend/
├── apps/
│   ├── dashboard/          # Enterprise admin dashboard
│   └── widget/             # Embeddable chat widget (future)
├── packages/
│   └── ui/                 # Shared UI components (future)
├── turbo.json             # Turborepo configuration
└── pnpm-workspace.yaml    # PNPM workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [pnpm 8+](https://pnpm.io/)

### Installation

1. **Install dependencies:**

```bash
cd frontend
pnpm install
```

2. **Set up environment variables:**

```bash
# In apps/dashboard, copy the example file
cp apps/dashboard/.env.local.example apps/dashboard/.env.local

# Edit the file with your values
```

3. **Run the development server:**

```bash
# Run all apps
pnpm dev

# Or run specific app
pnpm dev --filter dashboard
```

The dashboard will be available at:
- **Dashboard:** http://localhost:3000

## 🛠️ Development

### Running Apps

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter dashboard

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Type check
pnpm type-check
```

### Project Commands

```bash
# Install dependencies
pnpm install

# Add dependency to specific app
pnpm add <package> --filter dashboard

# Add dev dependency
pnpm add -D <package> --filter dashboard

# Clean (remove node_modules, .next, etc.)
pnpm clean

# Format code
pnpm format
```

## 📁 App Structure

### Dashboard App

```
apps/dashboard/
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── dashboard/     # Protected dashboard pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   ├── lib/              # Utilities & API client
│   └── store/            # Zustand state management
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Styling

This project uses:
- **Tailwind CSS** - Utility-first CSS framework
- **Custom color palette** - Primary colors defined in tailwind config
- **Responsive design** - Mobile-first approach

## 🔐 Authentication

Authentication is managed using:
- **Zustand** - State management for auth state
- **localStorage** - Token persistence
- **Axios interceptors** - Automatic token injection
- **Protected routes** - Client-side route protection

### Auth Flow

1. User logs in/registers
2. API returns JWT tokens (access + refresh)
3. Tokens stored in Zustand + localStorage
4. Axios automatically adds `Authorization: Bearer <token>` header
5. On 401, user is redirected to login

## 📦 Key Dependencies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching (future)
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect to Vercel
vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t customer-support-dashboard -f ../infrastructure/docker/frontend.Dockerfile .

# Run container
docker run -p 3000:3000 customer-support-dashboard
```

## 🧪 Testing (Future)

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

## 📖 API Integration

The dashboard connects to the backend API using Axios. Configuration in `src/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

### Available API Methods

```typescript
import { api } from '@/lib/api';

// Authentication
await api.auth.register(data);
await api.auth.login(data);
await api.auth.getCurrentUser();

// Domains (future)
await api.domains.getAll();

// Conversations (future)
await api.conversations.getAll();
```

## 🎯 Features Implemented

- ✅ User registration
- ✅ User login
- ✅ Protected dashboard
- ✅ JWT authentication
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling

## 📋 TODO

- [ ] Domain management UI
- [ ] Conversation viewer
- [ ] Knowledge base upload
- [ ] Real-time chat (SignalR)
- [ ] Analytics dashboard
- [ ] Settings pages
- [ ] Team management
- [ ] Chat widget

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Create a pull request

## 📄 License

MIT License - see LICENSE file for details

