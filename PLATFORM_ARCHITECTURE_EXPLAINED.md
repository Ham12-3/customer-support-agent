# 🏗️ Platform Architecture - URLs Explained

## 🤔 **Your Confusion (Totally Understandable!)**

You're asking:
> "Why is there a single Widget URL for all customers? Why localhost:3001? How does this relate to abdulhamid.dev?"

**Great question!** Let me break it down clearly.

---

## 🎯 **The Two Types of URLs**

### **Type 1: YOUR Platform URLs (Same for Everyone)**
These are **YOUR service URLs** - the platform you're building:

1. **Widget URL** (`localhost:3001` or `widget.nexusai.com`)
   - Where **YOUR widget JavaScript file** is hosted
   - **Same URL for ALL customers**
   - This is the widget script they download

2. **API Base URL** (`localhost:5000` or `api.nexusai.com`)
   - Where **YOUR backend API** is hosted
   - **Same URL for ALL customers**
   - This is where config is fetched from

### **Type 2: Customer Domains (Different for Each Customer)**
These are **customer website domains**:

- `abdulhamid.dev` - Customer 1's website
- `example.com` - Customer 2's website
- `shop.mystore.com` - Customer 3's website

**Each customer has their own domain, but they all use YOUR widget URL and API URL.**

---

## 🔄 **How It Works - Step by Step**

### **Example: Customer with domain `abdulhamid.dev`**

```
┌─────────────────────────────────────────────────────────┐
│  CUSTOMER'S WEBSITE: abdulhamid.dev                     │
│                                                          │
│  1. Customer adds embed script to their website:        │
│     ┌──────────────────────────────────────────┐        │
│     │ <script src="widget.nexusai.com/widget.js│        │
│     │   data-domain="abdulhamid.dev"          │        │
│     │   data-api-url="api.nexusai.com">       │        │
│     └──────────────────────────────────────────┘        │
│                                                          │
│  2. Visitor visits abdulhamid.dev                       │
│  3. Browser loads YOUR widget script from:              │
│     → widget.nexusai.com/widget.js                      │
│     (This is YOUR server, not their domain!)            │
│                                                          │
│  4. Widget script runs and reads:                       │
│     → data-domain="abdulhamid.dev"                      │
│                                                          │
│  5. Widget calls YOUR API:                              │
│     → GET api.nexusai.com/api/widget/config?            │
│        domain=abdulhamid.dev                            │
│     (Again, YOUR API server, not their domain!)         │
│                                                          │
│  6. YOUR backend:                                       │
│     → Looks up domain "abdulhamid.dev" in database      │
│     → Checks it's verified                              │
│     → Returns API key for that specific domain          │
│                                                          │
│  7. Widget initializes with config and shows on:        │
│     → abdulhamid.dev (their website)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 **Real-World Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR PLATFORM SERVERS                    │
│                                                              │
│  ┌──────────────────────┐  ┌─────────────────────────┐     │
│  │  Widget Server       │  │  Backend API Server     │     │
│  │  widget.nexusai.com  │  │  api.nexusai.com        │     │
│  │  (Port 3001)         │  │  (Port 5000)            │     │
│  │                      │  │                         │     │
│  │  Serves: widget.js   │  │  Serves: /api/widget/  │     │
│  │                      │  │            config       │     │
│  └──────────────────────┘  └─────────────────────────┘     │
│                                                              │
│  ✅ SAME URLs FOR ALL CUSTOMERS                             │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
        ┌───────────┴──────────┐        │
        │                       │        │
        ▼                       ▼        ▼
┌──────────────┐      ┌──────────────┐  ┌──────────────┐
│ Customer 1   │      │ Customer 2   │  │ Customer 3   │
│              │      │              │  │              │
│ abdulhamid.  │      │ example.com  │  │ myshop.com   │
│ dev          │      │              │  │              │
│              │      │              │  │              │
│ Loads widget │      │ Loads widget │  │ Loads widget │
│ from YOUR    │      │ from YOUR    │  │ from YOUR    │
│ server       │      │ server       │  │ server       │
└──────────────┘      └──────────────┘  └──────────────┘
```

---

## 🎯 **Why Single Widget URL & API URL?**

### **This is Standard SaaS Architecture:**

1. **Widget URL** - You host the widget script once, all customers download it
   - Like Google Analytics: Everyone uses `google-analytics.com/analytics.js`
   - Like Intercom: Everyone uses `widget.intercom.io/widget.js`
   - Like your platform: Everyone uses `widget.nexusai.com/widget.js`

2. **API URL** - You host the backend API once, all customers call it
   - Like Stripe API: Everyone calls `api.stripe.com`
   - Like your platform: Everyone calls `api.nexusai.com`

3. **Customer Domain** - Stored in database, used to:
   - Identify which customer's config to return
   - Verify domain ownership
   - Isolate data per tenant

---

## 🔍 **What Happens with Multiple Customers?**

### **Scenario: 3 Customers**

**Customer 1: abdulhamid.dev**
```html
<script src="widget.nexusai.com/widget.js"
        data-domain="abdulhamid.dev"
        data-api-url="api.nexusai.com"></script>
```

**Customer 2: example.com**
```html
<script src="widget.nexusai.com/widget.js"
        data-domain="example.com"
        data-api-url="api.nexusai.com"></script>
```

**Customer 3: myshop.com**
```html
<script src="widget.nexusai.com/widget.js"
        data-domain="myshop.com"
        data-api-url="api.nexusai.com"></script>
```

**Notice:**
- ✅ Same widget URL (`widget.nexusai.com`) - **YOUR server**
- ✅ Same API URL (`api.nexusai.com`) - **YOUR server**
- ❌ Different domains - **Their websites**

**Backend Database:**
```
domains table:
┌─────────────┬──────────────┬─────────────┐
│ DomainUrl   │ TenantId     │ ApiKey      │
├─────────────┼──────────────┼─────────────┤
│abdulhamid.dev│ tenant-1   │ sk_live_abc │
│example.com   │ tenant-2   │ sk_live_xyz │
│myshop.com    │ tenant-3   │ sk_live_123 │
└─────────────┴──────────────┴─────────────┘
```

When widget calls `/api/widget/config?domain=abdulhamid.dev`:
- Backend looks up `abdulhamid.dev` in database
- Returns API key `sk_live_abc` for that specific domain
- Each domain gets its own API key, but uses same widget/API URLs

---

## 🏠 **Why localhost:3001?**

**Development vs Production:**

### **Development (localhost:3001)**
- `localhost:3001` = Your local widget server (for testing)
- `localhost:5000` = Your local API server (for testing)
- Used when developing/testing on your machine

### **Production (Your Real URLs)**
- `widget.nexusai.com` = Your production widget CDN/server
- `api.nexusai.com` = Your production API server
- Used when customers actually embed the widget

**Configuration:**
```json
{
  "Widget": {
    "Url": "https://widget.nexusai.com"  // Production URL
  },
  "Api": {
    "BaseUrl": "https://api.nexusai.com"  // Production URL
  }
}
```

---

## 💡 **Key Takeaways**

1. **Widget URL & API URL** = YOUR platform URLs (shared by all customers)
2. **Customer Domains** = Their website domains (stored in database)
3. **Widget script** = Loaded from YOUR server, runs on THEIR website
4. **Config fetching** = Calls YOUR API, gets config for THEIR domain
5. **Multi-tenant** = Same URLs, different domains, isolated data

---

## 🎯 **Real-World Examples**

### **Google Analytics**
- Widget URL: `google-analytics.com/analytics.js` (same for everyone)
- Customer domain: `yourwebsite.com` (different for each customer)
- Config: Fetched based on tracking ID, not domain

### **Intercom**
- Widget URL: `widget.intercom.io/widget.js` (same for everyone)
- Customer domain: `yoursite.com` (different for each customer)
- Config: Fetched based on app ID

### **Your Platform**
- Widget URL: `widget.nexusai.com/widget.js` (same for everyone)
- Customer domain: `abdulhamid.dev` (different for each customer)
- Config: Fetched based on domain

---

## ✅ **Summary**

**You don't need separate Widget/API URLs per customer!**

- ✅ **Widget URL** = Where you host your widget script (one URL for all)
- ✅ **API URL** = Where you host your backend (one URL for all)
- ✅ **Customer Domain** = Their website (different for each, stored in DB)
- ✅ **Config Fetching** = Backend looks up domain in DB and returns config

**Think of it like:**
- Widget URL = The restaurant (one location)
- API URL = The kitchen (one location)
- Customer Domain = The table number (different for each customer)
- Database = The order system (knows which order belongs to which table)

---

**Does this make sense now?** 😊

