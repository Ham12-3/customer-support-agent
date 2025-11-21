# Quick Reference Guide

## 🎯 Key Concepts

### Multi-Tenancy
- Each enterprise customer is a **Tenant**
- Complete data isolation at the row level
- TenantId included in all queries
- Each tenant can have multiple domains, users, and agents

### RAG (Retrieval Augmented Generation)
```
1. User asks: "What's your refund policy?"
2. Convert question → vector embedding
3. Search vector DB for similar content
4. Retrieve top 5 relevant chunks
5. Inject chunks into LLM prompt as context
6. LLM generates answer based on actual company data
```

### Vector Embeddings
- Text → Array of 1536 numbers (OpenAI ada-002)
- Captures semantic meaning
- Similar concepts = similar vectors
- Example: "car" and "automobile" have close vectors

### Conversation Context
- **Short-term:** Current chat session
- **Long-term:** User preferences, past interactions
- Stored in Redis for fast access
- Helps maintain conversation continuity

---

## 🔧 Common Commands

### Backend (.NET)

```bash
# Create new project
dotnet new webapi -n ProjectName

# Add package
dotnet add package PackageName

# Restore dependencies
dotnet restore

# Build
dotnet build

# Run
dotnet run --project src/CustomerSupport.Api

# Run tests
dotnet test

# Watch mode (auto-reload)
dotnet watch run --project src/CustomerSupport.Api

# Create migration
dotnet ef migrations add MigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Apply migration
dotnet ef database update --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Rollback migration
dotnet ef database update PreviousMigrationName --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Remove last migration
dotnet ef migrations remove --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Generate SQL script
dotnet ef migrations script --project src/CustomerSupport.Infrastructure --startup-project src/CustomerSupport.Api

# Clean
dotnet clean

# Publish
dotnet publish -c Release -o ./publish
```

### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Type check
pnpm tsc --noEmit

# Run specific app
pnpm dev --filter dashboard
pnpm build --filter widget

# Add dependency to specific app
pnpm add packageName --filter dashboard

# Add dev dependency
pnpm add -D packageName

# Update dependencies
pnpm update

# Clean node_modules
pnpm clean
```

### Docker

```bash
# Build all services
docker-compose build

# Start services (detached)
docker-compose up -d

# Start specific service
docker-compose up backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend bash

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker ps

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a
```

### Database (PostgreSQL)

```bash
# Connect to database
psql -h localhost -U postgres -d customersupport

# Common SQL commands
\l              # List databases
\c dbname       # Connect to database
\dt             # List tables
\d tablename    # Describe table
\du             # List users
\q              # Quit

# Backup database
pg_dump -h localhost -U postgres customersupport > backup.sql

# Restore database
psql -h localhost -U postgres customersupport < backup.sql

# Create database
createdb -h localhost -U postgres customersupport

# Drop database
dropdb -h localhost -U postgres customersupport
```

### Git

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: add feature description"

# Push branch
git push origin feature/feature-name

# Update from main
git checkout main
git pull origin main
git checkout feature/feature-name
git merge main

# Squash commits
git rebase -i HEAD~3

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes
git stash
git stash pop

# View stash list
git stash list
```

---

## 📐 Naming Conventions

### C# (.NET)

```csharp
// Classes & Interfaces: PascalCase
public class CustomerService { }
public interface ICustomerService { }

// Methods: PascalCase
public async Task<Customer> GetCustomerAsync(Guid id) { }

// Properties: PascalCase
public string FirstName { get; set; }

// Private fields: _camelCase
private readonly ILogger _logger;

// Parameters & local variables: camelCase
public void ProcessOrder(int orderId)
{
    var orderTotal = CalculateTotal();
}

// Constants: PascalCase
public const int MaxRetries = 3;

// Async methods: Suffix with "Async"
public async Task SendEmailAsync() { }
```

### TypeScript/JavaScript

```typescript
// Files & folders: kebab-case
// user-service.ts, components/chat-window.tsx

// Classes & Types: PascalCase
class UserService { }
type UserProfile = { };
interface IUserService { }

// Functions & variables: camelCase
const getUserProfile = () => { };
let userName = "John";

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;

// React Components: PascalCase
export function ChatWindow() { }

// Boolean variables: prefix with "is", "has", "should"
const isLoading = true;
const hasPermission = false;
const shouldRender = true;

// Event handlers: prefix with "handle"
const handleClick = () => { };
const handleSubmit = (e: FormEvent) => { };
```

### Database

```sql
-- Tables: plural, snake_case
CREATE TABLE users ( );
CREATE TABLE conversation_messages ( );

-- Columns: snake_case
user_id, first_name, created_at

-- Indexes: idx_tablename_columnname
CREATE INDEX idx_users_email ON users(email);

-- Foreign keys: fk_tablename_columnname
ALTER TABLE messages ADD CONSTRAINT fk_messages_user_id FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## 🔑 Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=Host=localhost;Database=customersupport;Username=postgres;Password=postgres
REDIS_URL=localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_ISSUER=CustomerSupportAgent
JWT_AUDIENCE=CustomerSupportAPI
JWT_EXPIRATION_MINUTES=60

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7

# Vector Store (Pinecone)
VECTOR_STORE_PROVIDER=Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=customer-support

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service (Optional - commented out)
# SENDGRID_API_KEY=SG...
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_STORAGE_CONTAINER=documents

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Monitoring
SEQ_URL=http://localhost:5341
APPLICATION_INSIGHTS_KEY=...
```

### Frontend (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SIGNALR_URL=http://localhost:5000/hubs
NEXT_PUBLIC_WIDGET_URL=http://localhost:3001

# Auth
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Third-party
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-...
```

---

## 🎨 Common Design Patterns

### Repository Pattern

```csharp
// Interface
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
}

// Implementation
public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;
    
    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    
    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }
    
    // ... other methods
}
```

### Service Pattern

```csharp
// Interface
public interface ICustomerService
{
    Task<CustomerDto> GetCustomerAsync(Guid id);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto);
}

// Implementation
public class CustomerService : ICustomerService
{
    private readonly IRepository<Customer> _repository;
    private readonly IMapper _mapper;
    
    public CustomerService(IRepository<Customer> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }
    
    public async Task<CustomerDto> GetCustomerAsync(Guid id)
    {
        var customer = await _repository.GetByIdAsync(id);
        if (customer == null)
            throw new NotFoundException("Customer not found");
            
        return _mapper.Map<CustomerDto>(customer);
    }
}
```

### Custom Hooks (React)

```typescript
// useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load user from storage
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await fetchUser(token);
        setUser(user);
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return { user, loading, login, logout };
}

// Usage
function Dashboard() {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <LoginPage />;
  
  return <div>Welcome {user.name}</div>;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: EF Migration fails with "pending migration"
```bash
# Solution 1: Apply migrations
dotnet ef database update

# Solution 2: Drop database and recreate
dotnet ef database drop
dotnet ef database update

# Solution 3: Remove last migration and recreate
dotnet ef migrations remove
dotnet ef migrations add NewMigration
dotnet ef database update
```

### Issue: CORS error in browser
```csharp
// Solution: Add CORS policy in Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

### Issue: SignalR connection fails
```typescript
// Solution: Add proper URL and credentials
const connection = new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hubs/chat', {
    accessTokenFactory: () => localStorage.getItem('token') || '',
    withCredentials: false
  })
  .withAutomaticReconnect()
  .build();
```

### Issue: OpenAI API rate limit
```csharp
// Solution: Implement retry with exponential backoff
public async Task<string> CallOpenAIWithRetryAsync(string prompt)
{
    int maxRetries = 3;
    int delay = 1000;
    
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await _openAIService.CompleteAsync(prompt);
        }
        catch (RateLimitException)
        {
            if (i == maxRetries - 1) throw;
            await Task.Delay(delay);
            delay *= 2; // Exponential backoff
        }
    }
}
```

### Issue: Vector search returns irrelevant results
```csharp
// Solution 1: Improve chunking strategy
// - Use semantic chunking (by paragraphs, not fixed length)
// - Add overlap between chunks
// - Include surrounding context

// Solution 2: Add metadata filtering
var results = await _vectorStore.SearchAsync(
    queryEmbedding,
    topK: 10,
    filter: new { tenant_id = tenantId, category = "product-info" }
);

// Solution 3: Increase similarity threshold
var relevantResults = results.Where(r => r.Score > 0.75);
```

---

## 📊 Performance Tips

### Database

```csharp
// ❌ Bad: N+1 query problem
var conversations = await _context.Conversations.ToListAsync();
foreach (var conv in conversations)
{
    conv.Messages = await _context.Messages
        .Where(m => m.ConversationId == conv.Id)
        .ToListAsync();
}

// ✅ Good: Eager loading
var conversations = await _context.Conversations
    .Include(c => c.Messages)
    .ToListAsync();

// ✅ Better: Projection (only needed fields)
var conversations = await _context.Conversations
    .Select(c => new ConversationDto
    {
        Id = c.Id,
        MessageCount = c.Messages.Count
    })
    .ToListAsync();
```

### Caching

```csharp
// Cache frequently accessed data
public async Task<Customer> GetCustomerAsync(Guid id)
{
    var cacheKey = $"customer:{id}";
    
    // Try get from cache
    var cached = await _cache.GetStringAsync(cacheKey);
    if (cached != null)
        return JsonSerializer.Deserialize<Customer>(cached);
    
    // Get from database
    var customer = await _repository.GetByIdAsync(id);
    
    // Store in cache
    await _cache.SetStringAsync(cacheKey, 
        JsonSerializer.Serialize(customer),
        new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        });
    
    return customer;
}
```

### React Query

```typescript
// Cache and reuse API calls
function ConversationList() {
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/api/conversations'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Data is automatically cached and reused
}
```

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (never committed)
- [ ] JWT tokens with expiration
- [ ] Refresh token rotation
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (sanitize output)
- [ ] CSRF tokens for state-changing operations
- [ ] Rate limiting on public endpoints
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Tenant isolation enforced (row-level security)
- [ ] Password hashing (BCrypt)
- [ ] PII data encrypted
- [ ] File upload validation (type, size)
- [ ] Regular dependency updates
- [ ] Error messages don't leak sensitive info

---

## 📞 Useful Links

### Documentation
- [.NET Docs](https://docs.microsoft.com/dotnet/)
- [EF Core Docs](https://docs.microsoft.com/ef/core/)
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Semantic Kernel Docs](https://learn.microsoft.com/semantic-kernel/)

### Tools
- [Postman](https://www.postman.com/)
- [Swagger Editor](https://editor.swagger.io/)
- [JWT Debugger](https://jwt.io/)
- [Regex101](https://regex101.com/)
- [DB Diagram](https://dbdiagram.io/)

### Communities
- [Stack Overflow](https://stackoverflow.com/)
- [r/dotnet](https://reddit.com/r/dotnet)
- [r/nextjs](https://reddit.com/r/nextjs)
- [Discord - .NET](https://discord.gg/dotnet)

---

## 💡 Pro Tips

1. **Always use async/await** for I/O operations
2. **Implement proper logging** from day one
3. **Write tests as you code** (TDD when possible)
4. **Use DTOs** to separate API contracts from domain models
5. **Keep controllers thin** - business logic in services
6. **Use dependency injection** for better testability
7. **Cache expensive operations** (embeddings, LLM calls)
8. **Monitor token usage** to control AI costs
9. **Implement graceful degradation** (fallbacks when AI fails)
10. **Version your APIs** from the start

---

This quick reference should help you navigate common tasks. Bookmark this page! 🔖


