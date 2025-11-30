# Backend-Widget Integration Guide

## Overview
This guide ensures your C# backend API is properly integrated with the widget frontend application.

---

## ✅ Current Integration Status

### 1. **API Endpoint: `/api/chat`** ✅

#### Widget Request Format (TypeScript)
```typescript
POST http://localhost:5000/api/chat
Headers: {
  'Content-Type': 'application/json',
  'X-API-Key': string (optional in dev),
  'X-Domain': string (optional in dev)
}
Body: {
  message: string,
  sessionId: string,
  domain?: string,
  apiKey?: string
}
```

#### Backend Expected Format (C#)
```csharp
public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}
```

#### Backend Response Format (C#)
```csharp
public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
```

**Status**: ✅ **ALIGNED** - Request/Response models match between frontend and backend.

---

### 2. **CORS Configuration** ✅

#### Backend CORS Settings
```json
"CORS": {
  "Origins": [
    "http://localhost:3000",  // Dashboard
    "http://localhost:3001"   // Widget
  ]
}
```

**Status**: ✅ **PROPERLY CONFIGURED** - Widget origin (localhost:3001) is allowed.

---

### 3. **Authentication Flow** ⚠️

#### Development Mode (Current)
- Widget sends requests **without** API key headers
- Backend checks `ASPNETCORE_ENVIRONMENT == "Development"`
- Returns mock responses for testing
- No authentication required

#### Production Mode (TODO)
- Widget must send `X-API-Key` and `X-Domain` headers
- Backend validates API key against Domains table
- Loads knowledge base for specific domain
- Full AI-powered responses

**Status**: ⚠️ **DEVELOPMENT MODE ACTIVE** - Requires production authentication implementation.

---

### 4. **API URL Configuration** ✅

#### Widget Configuration
```typescript
const apiUrl = params.get('apiUrl') || 
               process.env.NEXT_PUBLIC_API_URL || 
               'http://localhost:5000';
```

#### Backend Configuration
```json
"Api": {
  "BaseUrl": "http://localhost:5000"
}
```

**Status**: ✅ **ALIGNED** - Both use `http://localhost:5000` as default.

---

### 5. **Error Handling** ✅

#### Widget Error Handling
```typescript
catch (error) {
  // Shows fallback message
  // Logs error to console
  // Displays user-friendly error message
}
```

#### Backend Error Handling
```csharp
catch (Exception ex)
{
    _logger.LogError(ex, "Error processing chat message");
    
    if (isDevelopment) {
        return Ok(new ChatResponse {
            Message = "Development error message"
        });
    }
    
    return StatusCode(500, new { error = "Failed to process message" });
}
```

**Status**: ✅ **ALIGNED** - Both handle errors gracefully with fallback messages.

---

## 🔧 Required Improvements for Production

### 1. **Implement API Key Validation**

**Location**: `backend/src/CustomerSupport.Api/Controllers/ChatController.cs`

**TODO**:
```csharp
// Add API key validation logic
var apiKey = Request.Headers["X-API-Key"].FirstOrDefault();
var domain = Request.Headers["X-Domain"].FirstOrDefault();

// Query Domains table
var domainEntity = await _domainRepository.GetByApiKeyAsync(apiKey);
if (domainEntity == null || domainEntity.Domain != domain)
{
    return Unauthorized(new { error = "Invalid API key or domain" });
}
```

### 2. **Add Domain Repository Method**

**Location**: `backend/src/CustomerSupport.Core/Interfaces/IDomainRepository.cs`

**TODO**:
```csharp
Task<Domain?> GetByApiKeyAsync(string apiKey);
Task<bool> ValidateApiKeyAsync(string apiKey, string domain);
```

### 3. **Implement Knowledge Base Integration**

**Location**: `backend/src/CustomerSupport.Api/Controllers/ChatController.cs`

**TODO**:
```csharp
// Load relevant knowledge base chunks for the domain
var knowledgeChunks = await _knowledgeBaseRepository
    .GetRelevantChunksAsync(domainEntity.Id, request.Message);

// Build context for Gemini
var context = BuildContextFromKnowledge(knowledgeChunks);

// Generate AI response with context
var response = await _geminiService
    .GenerateResponseAsync(request.Message, context);
```

### 4. **Save Conversation to Database**

**Location**: `backend/src/CustomerSupport.Api/Controllers/ChatController.cs`

**TODO**:
```csharp
// Create conversation record
var conversation = new Conversation
{
    DomainId = domainEntity.Id,
    SessionId = request.SessionId,
    StartedAt = DateTime.UtcNow,
    Status = ConversationStatus.Active
};
await _conversationRepository.AddAsync(conversation);

// Save messages
var userMessage = new Message
{
    ConversationId = conversation.Id,
    Content = request.Message,
    Role = MessageRole.User,
    Timestamp = DateTime.UtcNow
};

var assistantMessage = new Message
{
    ConversationId = conversation.Id,
    Content = response,
    Role = MessageRole.Assistant,
    Timestamp = DateTime.UtcNow
};

await _messageRepository.AddAsync(userMessage);
await _messageRepository.AddAsync(assistantMessage);
await _unitOfWork.SaveChangesAsync();
```

### 5. **Add Rate Limiting for Widget Endpoint**

**Location**: `backend/src/CustomerSupport.Api/Program.cs`

**Current**: Widget endpoint uses global rate limiting (500 requests/min in dev, 30 requests/min in prod)

**TODO**: Consider adding specific rate limiting for chat endpoint
```csharp
// Add to Program.cs rate limiting config
if (path.Contains("/api/chat"))
{
    return RateLimitPartition.GetFixedWindowLimiter(ipAddress, _ => 
        new FixedWindowRateLimiterOptions
        {
            PermitLimit = isDevelopment ? 500 : 60, // 60 messages per minute in production
            Window = TimeSpan.FromMinutes(1)
        });
}
```

---

## 📋 Integration Checklist

### Backend Setup
- [x] ChatController created with SendMessage endpoint
- [x] CORS configured for widget origin (localhost:3001)
- [x] Development mode with mock responses
- [x] Error handling implemented
- [ ] Production API key validation
- [ ] Knowledge base integration
- [ ] Conversation persistence
- [ ] Domain-specific rate limiting

### Widget Setup
- [x] API endpoint configured
- [x] Request/Response models match backend
- [x] Error handling with fallback messages
- [x] Development mode without API key
- [x] Session ID generation
- [ ] Production API key from embed script
- [ ] Error analytics tracking

### Configuration Files
- [x] `appsettings.json` - Backend configuration
- [x] Widget environment variables
- [x] CORS origins properly set
- [ ] Production API URLs
- [ ] Environment-specific configs

---

## 🧪 Testing the Integration

### 1. **Test Development Mode**

```bash
# Terminal 1: Start backend
cd backend/src/CustomerSupport.Api
dotnet run

# Terminal 2: Start widget
cd frontend/apps/widget
npm run dev

# Visit: http://localhost:3001
# Send a message - should get mock response
```

### 2. **Test CORS**

Check browser console for CORS errors:
- ✅ No errors = CORS properly configured
- ❌ CORS error = Add widget origin to backend CORS config

### 3. **Test Error Handling**

1. Stop backend
2. Send message from widget
3. Should see fallback message: "I'm currently unable to process your request..."

### 4. **Test API Key (Production Simulation)**

```typescript
// In widget/src/app/page.tsx, change:
const isDevelopment = false; // Simulate production

// Backend should return 401 Unauthorized without valid API key
```

---

## 🔒 Security Considerations

### 1. **API Key Storage**
- ✅ Widget gets API key from embed script URL parameters
- ✅ Not hardcoded in widget code
- ⚠️ Transmitted in headers (use HTTPS in production)

### 2. **CORS**
- ✅ Specific origins configured (not wildcard)
- ⚠️ Add production widget domain when deploying

### 3. **Rate Limiting**
- ✅ Configured for all endpoints
- ⚠️ Consider stricter limits for unauthenticated widget requests

### 4. **Input Validation**
- ⚠️ Add validation for message length
- ⚠️ Sanitize user input before AI processing
- ⚠️ Add profanity filter if needed

---

## 📝 Quick Reference

### Widget API Call
```typescript
axios.post(`${apiUrl}/api/chat`, {
  message: string,
  sessionId: string,
  domain: string,
  apiKey: string
}, {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'X-Domain': domain
  }
})
```

### Backend Endpoint
```csharp
[HttpPost]
[Route("api/chat")]
public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
```

### Response Format
```json
{
  "message": "AI response here",
  "sessionId": "session_123_abc",
  "timestamp": "2025-11-28T10:30:00Z"
}
```

---

## 🚀 Deployment Checklist

### Before Production Deployment

1. **Backend**:
   - [ ] Remove development mock responses
   - [ ] Implement API key validation
   - [ ] Add conversation persistence
   - [ ] Configure production CORS origins
   - [ ] Set production rate limits
   - [ ] Enable HTTPS
   - [ ] Configure production Gemini API key

2. **Widget**:
   - [ ] Remove development bypass logic
   - [ ] Require API key from embed script
   - [ ] Update API URL to production
   - [ ] Enable error tracking/analytics
   - [ ] Test with real API key
   - [ ] Add loading states
   - [ ] Implement retry logic

3. **Configuration**:
   - [ ] Production `appsettings.json` with real secrets
   - [ ] Environment variables set
   - [ ] Database migrations applied
   - [ ] Redis cache configured
   - [ ] Logging configured

---

## 🛠️ Troubleshooting

### Issue: 401 Unauthorized in Development
**Solution**: Ensure `ASPNETCORE_ENVIRONMENT=Development` is set in backend

### Issue: CORS Error
**Solution**: Verify widget origin is in `appsettings.json` CORS:Origins array

### Issue: No Response from Backend
**Solution**: 
1. Check backend is running on port 5000
2. Verify firewall allows localhost:5000
3. Check browser console for errors

### Issue: Mock Responses in Production
**Solution**: Remove development mode checks in `ChatController.cs`

---

## 📚 Related Files

### Backend
- `backend/src/CustomerSupport.Api/Controllers/ChatController.cs` - Main chat endpoint
- `backend/src/CustomerSupport.Api/Program.cs` - CORS and rate limiting config
- `backend/src/CustomerSupport.Api/appsettings.json` - Configuration
- `backend/src/CustomerSupport.Infrastructure/Services/GeminiService.cs` - AI integration

### Widget
- `frontend/apps/widget/src/app/page.tsx` - Main widget component
- `frontend/apps/widget/public/widget.js` - Embed loader script
- `frontend/apps/widget/.env.local` - Environment variables

---

## ✅ Summary

**Current Status**: Development mode is fully functional ✅
- Widget can communicate with backend
- Mock responses working
- Error handling in place
- CORS configured correctly

**Next Steps for Production**: 
1. Implement API key validation
2. Add knowledge base integration
3. Persist conversations to database
4. Remove development bypass logic
5. Deploy with production configuration

The integration foundation is solid! The main work ahead is implementing the production authentication and knowledge base features.

