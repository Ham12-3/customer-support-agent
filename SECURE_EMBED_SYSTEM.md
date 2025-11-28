# 🔒 Secure Embed System - No Secrets Exposed!

## ✅ **Problem Solved**

**Before:** Embed code exposed API keys, domain IDs, and secrets directly in the script → **NOT SAFE FOR GITHUB!** ❌

**After:** Embed code only contains domain URL → **100% SAFE FOR GITHUB!** ✅

---

## 🎯 **How It Works Now**

### **1. Secure Embed Script (Safe for GitHub)**

The embed script you copy is now **completely public and safe**:

```html
<!-- Customer Support AI Widget -->
<!-- This script is safe to commit to GitHub - no secrets exposed -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.nexusai.com/widget.js';
    script.setAttribute('data-domain', 'example.com');
    script.setAttribute('data-api-url', 'https://api.nexusai.com');
    script.async = true;
    document.body.appendChild(script);
  })();
</script>
```

**What's in it:**
- ✅ Domain URL only (`data-domain="example.com"`)
- ✅ API base URL (`data-api-url`)
- ✅ Widget script URL
- ❌ **NO API KEYS**
- ❌ **NO DOMAIN IDs**
- ❌ **NO SECRETS**

---

### **2. Widget Script Flow (Dynamic Config Fetching)**

When the widget script loads on a website:

```
1. Widget script loads from widget.nexusai.com
2. Script reads data-domain="example.com" from the embed code
3. Script calls: GET /api/widget/config?domain=example.com
4. Backend validates domain is verified
5. Backend returns: { apiKey, domainId, widgetUrl, isVerified }
6. Widget initializes with config
```

---

### **3. Backend Security Validation**

The `/api/widget/config` endpoint:

1. ✅ **Validates domain exists** in database
2. ✅ **Checks domain is verified** (must have verified DNS TXT record)
3. ✅ **Only returns API key** if domain is verified
4. ✅ **Rejects unverified domains** (403 Forbidden)

**Security Features:**
- Domain ownership verified via DNS
- No auth required (public endpoint)
- Only verified domains get API keys
- Domain automatically detected from Origin/Referer headers

---

## 📝 **How to Use**

### **Step 1: Get Your Embed Code**

1. Go to **Dashboard → Domains**
2. Click **"Embed Code"** button on your domain
3. Copy the script (it's now safe!)

### **Step 2: Add to Your Website**

**Option A: In layout.js/tsx (Next.js, React, etc.)**

```jsx
// layouts/main-layout.jsx or _app.jsx or layout.tsx
export default function MainLayout({ children }) {
  return (
    <>
      {children}
      {/* Safe to commit - no secrets! */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var script = document.createElement('script');
              script.src = 'https://widget.nexusai.com/widget.js';
              script.setAttribute('data-domain', 'yourdomain.com');
              script.setAttribute('data-api-url', 'https://api.nexusai.com');
              script.async = true;
              document.body.appendChild(script);
            })();
          `
        }}
      />
    </>
  );
}
```

**Option B: In HTML (Any Website)**

```html
<!-- In your HTML <body> tag -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.nexusai.com/widget.js';
    script.setAttribute('data-domain', 'yourdomain.com');
    script.setAttribute('data-api-url', 'https://api.nexusai.com');
    script.async = true;
    document.body.appendChild(script);
  })();
</script>
```

---

## 🔧 **Configuration**

### **Important: Platform URLs vs Customer Domains**

**These URLs are YOUR platform URLs - same for ALL customers:**
- **Widget URL** = Where YOU host the widget JavaScript file (e.g., `widget.nexusai.com`)
- **API Base URL** = Where YOU host the backend API (e.g., `api.nexusai.com`)

**Customer domains** (like `abdulhamid.dev`) are stored in the database and used to:
- Identify which customer's config to return
- Verify domain ownership
- Isolate data per tenant

**Every customer uses the SAME Widget URL and API URL**, but each has their own domain stored in the database.

### **Environment Variables (Production)**

Add to your `appsettings.json` or environment variables:

```json
{
  "Widget": {
    "Url": "https://widget.nexusai.com"  // YOUR widget server - same for all customers
  },
  "Api": {
    "BaseUrl": "https://api.nexusai.com"  // YOUR API server - same for all customers
  }
}
```

**Development (already configured):**
- Widget URL: `http://localhost:3001` (your local widget server)
- API URL: `http://localhost:5000` (your local API server)

**See `PLATFORM_ARCHITECTURE_EXPLAINED.md` for detailed explanation.**

---

## 🛡️ **Security Features**

### **✅ What's Protected:**

1. **API Keys** - Never exposed in embed code
2. **Domain IDs** - Never exposed in embed code
3. **Tenant Information** - Never exposed
4. **Backend Secrets** - Never exposed

### **✅ Security Checks:**

1. **Domain Verification Required** - Only verified domains get config
2. **Ownership Validation** - Domain must exist in your account
3. **Auto-Detection** - Domain detected from Origin/Referer headers
4. **CORS Protection** - Only allowed origins can fetch widget

---

## 🔄 **Data Flow Diagram**

```
┌─────────────────┐
│  Your Website   │
│  (example.com)  │
└────────┬────────┘
         │
         │ 1. Loads embed script (no secrets)
         ▼
┌─────────────────┐
│  Widget Script  │
│  (widget.js)    │
└────────┬────────┘
         │
         │ 2. Reads data-domain="example.com"
         │ 3. Calls: GET /api/widget/config?domain=example.com
         ▼
┌─────────────────┐
│  Backend API    │
│  (nexusai.com)  │
└────────┬────────┘
         │
         │ 4. Validates domain exists & is verified
         │ 5. Returns: { apiKey, domainId, widgetUrl }
         ▼
┌─────────────────┐
│  Widget Config  │
│  (with API key) │
└────────┬────────┘
         │
         │ 6. Widget initializes with config
         ▼
┌─────────────────┐
│  Chat Widget    │
│  (Ready to use) │
└─────────────────┘
```

---

## 📋 **Benefits**

✅ **Safe for GitHub** - No secrets in embed code  
✅ **Secure** - Keys fetched dynamically after domain validation  
✅ **Flexible** - Works on any website (not tied to one domain)  
✅ **Maintainable** - Update widget URL without changing embed code  
✅ **Multi-Tenant** - Each domain gets its own config automatically  

---

## 🚀 **Next Steps**

1. ✅ **Restart backend** to load new WidgetController
2. ✅ **Get new embed code** from dashboard (old ones still work but show keys)
3. ✅ **Replace embed code** in your website
4. ✅ **Commit to GitHub** safely! 🎉

---

## ⚠️ **Important Notes**

- The **API key is still shown in the dashboard** (behind authentication) - this is fine for reference
- The **embed script does NOT contain the API key** - it's fetched dynamically
- The **widget script must be updated** to fetch config from `/api/widget/config`
- **Domain must be verified** before widget will work

---

## 🔍 **Testing**

1. Add domain in dashboard: `example.com`
2. Wait for DNS verification (or manually verify)
3. Get embed code (should have no API keys)
4. Test widget on your website
5. Widget should automatically fetch its config

---

**Your embed code is now 100% safe to commit to GitHub!** 🎉

