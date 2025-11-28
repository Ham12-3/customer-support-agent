# Running the Customer Support Agent Application

## Prerequisites
- .NET 9.0 SDK
- Node.js 18+ and pnpm
- PostgreSQL database

## Database Setup

### 1. Apply the new migration
```bash
cd backend
psql -U postgres -d customer_support -f migrations/add-user-profile-fields.sql
```

Or run from the backend directory:
```bash
cd backend/src/CustomerSupport.Api
dotnet ef database update
```

## Backend Setup

### 1. Navigate to the API project
```bash
cd backend/src/CustomerSupport.Api
```

### 2. Build the project
```bash
dotnet build
```

### 3. Run the backend
```bash
dotnet run
```

The API will start on `http://localhost:5000` (or `https://localhost:5001`)

## Frontend Setup

### 1. Navigate to the dashboard app
```bash
cd frontend/apps/dashboard
```

### 2. Install dependencies (if not already done)
```bash
pnpm install
```

### 3. Set environment variables
Create or update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the development server
```bash
pnpm dev
```

The dashboard will start on `http://localhost:3000`

## Testing the Integration

### 1. Register a new account
- Go to `http://localhost:3000/register`
- Create a new account

### 2. Login
- Use your credentials to log in
- You'll be redirected to the dashboard

### 3. Test Dashboard Features

#### Dashboard Overview (`/dashboard`)
- View real-time statistics
- See analytics chart with actual data
- Monitor system health
- View active domains

#### Conversations (`/dashboard/conversations`)
- View all conversations
- Filter by status
- Click to see message details

#### Domains (`/dashboard/domains`)
- Add new domains
- Get embed codes
- Delete domains

#### Knowledge Base (`/dashboard/knowledge-base`)
- Upload documents
- View processing status
- Delete documents

#### Settings (`/dashboard/settings`)
- **Profile Tab**: Update your name, company, role, timezone
- **Security Tab**: Change password, view active sessions
- **Notifications Tab**: Configure notification preferences
- **Billing Tab**: View subscription and invoices
- **API Keys Tab**: Generate and manage API keys

## Troubleshooting

### Backend Issues

**Build errors:**
```bash
cd backend/src/CustomerSupport.Api
dotnet clean
dotnet build
```

**Database connection:**
- Check `appsettings.json` connection string
- Ensure PostgreSQL is running
- Verify database exists

### Frontend Issues

**Module not found:**
```bash
cd frontend
pnpm install
```

**API connection:**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check browser console for CORS errors

**Build errors:**
```bash
cd frontend/apps/dashboard
pnpm clean
pnpm install
pnpm dev
```

## API Endpoints Reference

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/analytics` - Analytics data
- `GET /api/dashboard/system-health` - System health

### User
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `GET /api/users/sessions` - Active sessions
- `DELETE /api/users/sessions/{id}` - Revoke session
- `GET /api/users/notifications` - Notification preferences
- `PUT /api/users/notifications` - Update preferences

### Billing
- `GET /api/billing/subscription` - Subscription info
- `GET /api/billing/payment-methods` - Payment methods
- `GET /api/billing/invoices` - Invoice history

### API Keys
- `GET /api/api-keys` - List API keys
- `POST /api/api-keys` - Create API key
- `DELETE /api/api-keys/{id}` - Revoke API key

### Existing Endpoints
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET /api/domains` - List domains
- `POST /api/domains` - Create domain
- `DELETE /api/domains/{id}` - Delete domain
- `GET /api/conversations` - List conversations
- `GET /api/conversations/{id}` - Get conversation
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `DELETE /api/documents/{id}` - Delete document

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Backend: Changes to `.cs` files trigger rebuild
- Frontend: Changes to `.tsx` files update instantly

### Debugging
**Backend:**
```bash
cd backend/src/CustomerSupport.Api
dotnet run --launch-profile https
```
Then attach debugger in VS Code or Visual Studio

**Frontend:**
- Use browser DevTools
- Check Network tab for API calls
- Use React DevTools extension

### Database Queries
View SQL queries in backend logs:
```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

## Production Deployment

### Backend
1. Update `appsettings.Production.json`
2. Set production connection string
3. Build in Release mode:
   ```bash
   dotnet publish -c Release
   ```

### Frontend
1. Update environment variables
2. Build for production:
   ```bash
   pnpm build
   ```
3. Deploy to Vercel/Netlify or run:
   ```bash
   pnpm start
   ```

## Success Indicators

✅ Backend running without errors
✅ Frontend loads without console errors
✅ Dashboard shows real statistics
✅ Settings can be saved successfully
✅ All CRUD operations work
✅ Authentication flow works
✅ Data persists across sessions

Enjoy your fully integrated luxury customer support dashboard! 🚀

