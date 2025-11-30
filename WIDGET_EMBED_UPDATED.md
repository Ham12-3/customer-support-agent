# ✅ Widget Embed Code Updated!

## 🎯 WHAT WAS FIXED

### **Problem:**
The embed code generated in the dashboard was **missing the API key attribute**.

### **Solution:**
Updated the backend `DomainsController.cs` to include `data-api-key` in the embed code.

---

## 📝 UPDATED EMBED CODE

### **Now the dashboard generates:**

```html
<!-- Customer Support AI Widget -->
<!-- Paste this before the closing </body> tag -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:3001/widget.js';
    script.setAttribute('data-domain', 'customer-domain.com');
    script.setAttribute('data-api-key', 'abc123xyz789');  // ✅ NOW INCLUDED!
    script.setAttribute('data-api-url', 'http://localhost:5000');
    script.async = true;
    document.body.appendChild(script);
  })();
</script>
```

---

## 🔄 COMPLETE FLOW

### **1. Platform Owner (You):**

**A. Create & Host widget.js (One Time)**
- Created: `widget.js` (already done! ✅)
- Host location options:
  ```
  Option 1: backend/wwwroot/widget.js
  Option 2: CDN (S3/CloudFlare)
  Option 3: Separate static server
  ```

**B. Backend Configuration**
- `DomainsController.cs` generates embed code with API key
- Each domain gets unique API key
- Embed code auto-populated with domain + API key

---

### **2. Customer Workflow:**

**Step 1: Register & Add Domain**
```
Customer → Dashboard → Domains → Add Domain
```

**Step 2: Get Embed Code**
```
Dashboard generates:
├── Unique API Key for their domain
├── Embed code with API key pre-filled
└── Ready to copy/paste
```

**Step 3: Copy & Paste**
```html
Customer copies the code:
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-platform.com/widget.js';  ← Your hosted file
    script.setAttribute('data-domain', 'customer-site.com');  ← Their domain
    script.setAttribute('data-api-key', 'their-unique-key');  ← Their key
    script.setAttribute('data-api-url', 'https://api.your-platform.com');
    script.async = true;
    document.body.appendChild(script);
  })();
</script>
```

**Step 4: Widget Works!**
```
Customer's website → Loads widget.js → Authenticates with API key → Chat works!
```

---

## 🔑 HOW API KEY AUTHENTICATION WORKS

### **Widget Load Flow:**

```
1. Customer's Website
   └── Loads widget.js from YOUR domain

2. Widget.js Reads Configuration
   ├── data-domain: 'customer-site.com'
   ├── data-api-key: 'abc123xyz789'
   └── data-api-url: 'https://api.your-platform.com'

3. Customer Sends Chat Message
   └── Widget sends to API with headers:
       ├── X-API-Key: abc123xyz789
       └── X-Domain: customer-site.com

4. Backend Validates (ChatController.cs)
   ├── Is API key valid? ✓
   ├── Does it match this domain? ✓
   ├── Is domain active? ✓
   └── If all pass → Process chat ✓

5. Customer Gets Response
   └── AI-powered response delivered
```

---

## 🧪 TESTING (localhost:3002)

### **Test Your Setup:**

**1. Start Backend:**
```cmd
cd backend/src/CustomerSupport.Api
dotnet run
```

**2. Start Dashboard:**
```cmd
cd frontend/apps/dashboard
npm run dev
```

**3. Add Test Domain:**
- Go to: http://localhost:3000/dashboard/domains
- Add domain: `localhost:3002`
- Click "Embed Code"
- **Copy the generated code** (now includes API key!)

**4. Update Test HTML:**
- Open `widget-test-embed.html`
- Paste the embed code from dashboard
- Save the file

**5. Copy to Index:**
```cmd
copy widget-test-embed.html index.html
```

**6. Start Test Server:**
```cmd
serve-test-page.bat
```

**7. Test in Browser:**
- Visit: http://localhost:3002
- Click chat button
- Send message
- Get response! 🎉

---

## 📋 FILES MODIFIED

### **Backend:**
- `backend/src/CustomerSupport.Api/Controllers/DomainsController.cs`
  - ✅ Line 192: Added `data-api-key` to HTML embed
  - ✅ Line 224: Added `data-api-key` to React embed

### **Created:**
- `widget.js` - Standalone widget implementation
- `widget-test-embed.html` - Test page template
- `serve-test-page.bat` - CMD-compatible test server

---

## 🎯 KEY POINTS

### ✅ **DO's:**
- ✅ Create ONE `widget.js` for all customers
- ✅ Host `widget.js` on YOUR domain/CDN
- ✅ Generate embed code with unique API key per customer
- ✅ Customers just copy/paste the embed code
- ✅ Backend validates API key for each request

### ❌ **DON'Ts:**
- ❌ Customers don't create widget.js
- ❌ Customers don't manually add API key
- ❌ Don't hardcode API keys in widget.js
- ❌ Don't share same API key across domains

---

## 🚀 PRODUCTION SETUP

### **When Ready for Production:**

**1. Host widget.js:**
```bash
# Option A: Backend wwwroot
PUT widget.js in: backend/wwwroot/

# Option B: CDN (recommended)
Upload to S3/CloudFlare CDN
URL: https://cdn.yourdomain.com/widget.js
```

**2. Update appsettings.json:**
```json
{
  "Widget": {
    "Url": "https://cdn.yourdomain.com"  // or "https://yourdomain.com"
  },
  "Api": {
    "BaseUrl": "https://api.yourdomain.com"
  }
}
```

**3. Customer Embed Code Changes Automatically:**
```
Dashboard automatically uses production URLs:
- Widget: https://cdn.yourdomain.com/widget.js
- API: https://api.yourdomain.com
```

---

## ✅ SUMMARY

**What Changed:**
- ✅ Backend now includes API key in embed code
- ✅ Dashboard shows complete embed code
- ✅ Customers get ready-to-use code
- ✅ No manual configuration needed

**What Stays Same:**
- ✅ ONE widget.js for everyone
- ✅ YOU host widget.js
- ✅ Backend validates all requests
- ✅ Secure authentication

**Current Status:**
- ✅ Backend updated
- ✅ Embed code includes API key
- ✅ Test environment ready
- ✅ Ready to test!

---

**Next Step:** Test it by following the "Testing" section above! 🚀

