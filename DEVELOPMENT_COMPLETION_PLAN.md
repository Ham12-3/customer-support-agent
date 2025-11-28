# Development Completion Plan

This document captures the major gaps that prevent `customer-support-agent` from being a production-complete AI customer-support platform, along with an execution plan to close them. Findings are based on the current codebase (`backend/src`, `frontend/apps`, `docker-compose.yml`) and the project docs (`README.md`, `IMPLEMENTATION_ROADMAP.md`, refactoring checklists, etc.) as of 27 Nov 2025.

---

## 1. Current State Snapshot

- **MVP backend & dashboard exist**, but several controllers return mock data or rely on in-memory filtering that will not scale.
- **AI/RAG pipeline is not implemented**: `CustomerSupport.Agent` has no source files, `DocumentsController` sets documents to `Processing` without chunking/vector storage, and `ChatController` has TODOs for API-key validation, retrieval, and persistence.
- **Frontend dashboard refactor is only ~18% complete** (`FRONTEND_REFACTORING_CHECKLIST.md`); critical hooks/components exist but are not wired into pages, and high/medium priority UX work remains.
- **Embeddable widget is skeletal** (`frontend/apps/widget` only contains a placeholder page) and no real-time SignalR/Handoff experience is present.
- **Billing, analytics, and security features are placeholders** (`BillingController` returns hardcoded data; no rate limiting, audit trails, or background jobs are configured).
- **Testing, CI/CD, and observability are absent** beyond manual instructions; no automated test suites or pipelines enforce quality.

---

## 2. Gap Inventory & Required Work

| Area | Current Symptoms | Missing for Completion | Evidence | Proposed Actions |
| --- | --- | --- | --- | --- |
| **AI Orchestration & RAG** | `CustomerSupport.Agent` project contains no implementation; `GeminiService` just forwards prompts without knowledge base context. | Retrieval pipeline (embeddings, vector store, conversation memory, guardrails) and configurable LLM adapters. | Empty `backend/src/CustomerSupport.Agent/`; `GeminiService.BuildPrompt` comments referencing future context. | 1) Define domain services for ingestion, retrieval, response ranking. 2) Add embedding provider + vector DB integration (pgvector/Pinecone). 3) Build conversation state manager + guardrails. |
| **Content Ingestion Pipeline** | `DocumentsController` marks uploads as `Processing` but never chunks or vectorizes; no background jobs or storage abstraction. | File parsing, text cleaning, chunking, embedding, status transitions, error handling, retries. | `DocumentsController.cs` lines with `// TODO: Trigger background processing...`. | 1) Create ingestion worker (Hangfire/HostedService). 2) Implement parsers (PDF, DOCX, URL crawler). 3) Persist chunks + embeddings + link to documents. 4) Emit progress events for UI. |
| **Conversation & Chat Flow** | `ChatController` has TODOs for API key validation, knowledge retrieval, storing conversations/messages; SignalR hubs absent. | Full message lifecycle (tenant auth via API keys, knowledge retrieval, persistence, analytics counters, escalation triggers) and WebSocket/SignalR hubs for live updates. | `ChatController.cs` TODO comments; `ConversationsController` pulls *all* rows in memory `GetAllAsync`. | 1) Implement Domain API-key validation + throttling. 2) Add conversation service that writes Conversation/Message entities inside UnitOfWork. 3) Add SignalR hubs for widget/dashboard streaming. 4) Replace repository `GetAllAsync` usage with paged queries (specifications or EF queries). |
| **Human Handoff & Agent Dashboard** | No queueing, assignment, or `HumanHandoff` service despite roadmap promises; `ConversationsController` only toggles flags manually. | Escalation detection, agent availability tracking, queue routing, live chat bridging, SLA tracking. | README “Phase 2” + `ARCHITECTURE_PLAN.md` sections unimplemented; codebase lacks `CustomerSupport.RealTime` project. | 1) Design escalation rules + queue schema. 2) Implement SignalR AgentHub & CustomerHub. 3) Build dashboard UI for agents to claim/resolve chats. |
| **Billing & Subscription** | `BillingController` returns mocked subscription/payment/invoice data; no Stripe integration, plan enforcement, or usage tracking. | Real payment provider integration, webhooks, plan enforcement, usage metering, invoice storage. | `BillingController.cs` lines 27-110 with “Mock implementation” comments. | 1) Introduce billing service (Stripe). 2) Add plan metadata to `Tenant`. 3) Track message/token counts per tenant. 4) Surface usage + payment UI. |
| **Domain Verification & Widget Delivery** | `DomainsController` generates verification codes but never checks DNS; widget script is hardcoded to `localhost` and `frontend/apps/widget` is an empty shell. | DNS verification workflow, production-ready widget bundle with customization + API-key bootstrapping, CDN packaging. | `DomainsController.cs` lacks DNS lookup; widget app contains only boilerplate. | 1) Implement TXT lookup (e.g., DnsClient). 2) Persist verification attempts & statuses. 3) Build widget UI + state mgmt + SignalR client. 4) Provide build pipeline to publish `widget.js`. |
| **Frontend Dashboard Completion** | Component library + hooks exist but not used; 33 of 40 issues still open (accessibility, loading states, routing, forms, notifications, responsive layouts). | Refactor login/register/dashboard pages, add protected routes, loading/empty states, toasts, responsive layouts, accessibility fixes, analytics pages, knowledge base UI, domain wizard, conversation viewer, billing screens. | `FRONTEND_REFACTORING_CHECKLIST.md` shows only 7/40 issues closed. | 1) Execute Phase 2 tasks (hooks into pages, toasts, routing). 2) Implement domain/doc/convo views leveraging new UI kit. 3) Add React Query + caching for data. 4) Complete Phase 3/4 UX work (mobile, i18n, testing). |
| **Testing & Quality Gates** | No automated tests beyond scaffolding; `CustomerSupport.Tests` folder is empty; no frontend tests; docs mention future addition. | Unit tests for services, integration tests for API, contract tests for frontend API client, e2e widget tests, CI pipeline enforcing lint/test. | `backend/tests/CustomerSupport.Tests` contains only project file; `frontend` README lists “Testing (Future)”. | 1) Populate backend tests (AuthService, Controllers, Repositories). 2) Add Playwright/Cypress for widget & dashboard. 3) Configure GitHub Actions/Azure Pipelines for CI/CD. |
| **Security & Compliance** | No rate limiting, audit logging, secrets management, or PII masking implemented; JWT refresh partially done on frontend but backend lacks refresh endpoint; no password policies. | Rate limiting middleware, FluentValidation, audit fields, encryption policies, refresh-token storage, secret rotation, compliance workflows (GDPR exports/deletion). | `REFACTORING_CHECKLIST.md` shows these tasks as TODO; `TokenRefresh` note indicates backend endpoint missing. | 1) Add FluentValidation + AutoMapper + Result pattern across services. 2) Implement refresh token store & `/auth/refresh`. 3) Add rate limiting + global exception handling + audit logs. 4) Build data privacy endpoints. |
| **Observability & Operations** | Logging limited to Serilog file output; no metrics, tracing, or health checks; Docker Compose only runs Postgres/Redis, backend commented out. | Centralized logging, metrics (App Insights/OTel), health endpoints, structured tracing, production-ready docker images, environment parity. | `docker-compose.yml` backend service commented; `REFACTORING_CHECKLIST.md` low-priority items include logging & health checks. | 1) Enable backend container + configure env vars/secrets. 2) Add health checks for DB/Redis. 3) Add structured logging + correlation IDs. 4) Provide deployment IaC (AKS/App Service) + monitoring dashboards. |

---

## 3. Phased Execution Plan

### Phase A — Stabilize & Unblock (Weeks 1-3)
1. **Backend hardening**: Finish outstanding checklist items (FluentValidation, AutoMapper, Result pattern, rate limiting, global exception handling, audit fields, health checks).
2. **Auth/session completeness**: Implement refresh-token endpoint + store; enforce password complexity and lockouts.
3. **Domain & billing reality**: Build DNS verification worker and replace mocked billing responses with Stripe test mode integration.
4. **Frontend Phase 2**: Wire new hooks/components into login/register/dashboard, add protected routes (middleware), loading/empty states, toasts, and consistent routing.

### Phase B — Core Feature Completion (Weeks 4-8)
1. **Content ingestion + vector store**: Stand up ingestion worker, connect to pgvector/Pinecone, and surface processing status in UI.
2. **AI agent pipeline**: Implement retrieval pipeline, conversation memory, guardrails, and integrate with Gemini/OpenAI via configuration.
3. **Conversation lifecycle & human handoff**: Add SignalR hubs, queueing, escalation UI for agents, and analytics updates.
4. **Widget productization**: Build the embeddable widget UI, configuration handshake (API key + domain settings), real-time messaging, and packaging for CDN delivery.
5. **Frontend Phase 3**: Mobile responsiveness, accessibility, React Query caching, optimistic updates, dark mode, micro-interactions.

### Phase C — Monetization, Compliance, and Scale (Weeks 9-12)
1. **Billing & usage enforcement**: Implement subscription tiers, usage metering, invoice storage, and webhook-driven status updates.
2. **Security & compliance features**: GDPR export/delete endpoints, PII masking in logs, auditing dashboards, role-based permissions for team management.
3. **Analytics & reporting**: Build dashboard widgets for conversation KPIs, exportable reports, and alerting for SLA breaches.
4. **Testing & DevOps**: Add backend unit/integration tests, frontend unit/e2e suites, CI/CD pipelines, containerized deployments, monitoring/alerting stack.

---

## 4. Immediate Next Actions

1. **Create detailed tickets** for each gap above (e.g., “Implement document ingestion worker”, “Build widget SignalR client”) and assign owners with estimates.
2. **Prioritize Phase A backlog** in the project board to unblock downstream feature work.
3. **Enable backend container in `docker-compose.yml`** once config secrets are in place, ensuring local parity for multi-service testing.
4. **Schedule cross-functional design sessions** (AI/ML, frontend UX, DevOps) to finalize API contracts before implementing Phase B components.

Delivering the above plan will align the codebase with the roadmap commitments outlined in `README.md` and `ARCHITECTURE_PLAN.md`, while providing a concrete path to a production-ready release.


