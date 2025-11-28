# 🎨 How to Run the Widget

The widget is the embeddable chat widget that customers can add to their websites.

---

## 🚀 Quick Start

### Option 1: Run Widget Only (Recommended)

```powershell
# Navigate to widget directory
cd frontend\apps\widget

# Install dependencies (first time only)
pnpm install

# Run the widget
pnpm dev
```

**Widget will be available at:** http://localhost:3001

---

### Option 2: Run Widget with Dashboard (Both Apps)

From the `frontend` directory:

```powershell
# Navigate to frontend root
cd frontend

# Run all apps (dashboard + widget)
pnpm dev
```

This will start:
- **Dashboard:** http://localhost:3000
- **Widget:** http://localhost:3001

---

### Option 3: Run Widget Using Turbo (Monorepo)

```powershell
# From frontend root
cd frontend

# Run only widget
pnpm --filter @customer-support/widget dev

# Or run all apps
pnpm dev
```

---

## 📋 Prerequisites

Before running the widget, make sure:

1. ✅ **Backend API is running** (http://localhost:5000)
   ```powershell
   cd backend\src\CustomerSupport.Api
   dotnet run
   ```

2. ✅ **Dependencies are installed**
   ```powershell
   cd frontend
   pnpm install
   ```

3. ✅ **Environment variables are set** (if needed)
   - Widget typically doesn't need `.env.local` for basic testing
   - It will use the API URL from the backend configuration

---

## 🎯 Access Points

Once running, you can access:

- **Widget App:** http://localhost:3001
- **Widget Script:** http://localhost:3001/widget.js (if configured)
- **Backend API:** http://localhost:5000 (must be running)

---

## 🧪 Testing the Widget

### Method 1: Direct Browser Access

1. Start the widget: `cd frontend\apps\widget && pnpm dev`
2. Open browser: http://localhost:3001
3. You should see the widget interface

### Method 2: Embed in HTML Page

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Test Page</h1>
    
    <!-- Embed the widget -->
    <script src="http://localhost:3001/widget.js" 
            data-domain-id="your-domain-id">
    </script>
</body>
</html>
```

Open this HTML file in your browser to test the embedded widget.

---

## 🛠️ Development Commands

### From Widget Directory

```powershell
cd frontend\apps\widget

# Development mode (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### From Frontend Root

```powershell
cd frontend

# Run widget only
pnpm --filter @customer-support/widget dev

# Run all apps
pnpm dev

# Build widget only
pnpm --filter @customer-support/widget build
```

---

## ⚙️ Configuration

### Port Configuration

The widget runs on port **3001** by default. This is configured in:
- `frontend/apps/widget/package.json`:
  ```json
  "dev": "next dev -p 3001",
  "start": "next start -p 3001"
  ```

To change the port, edit `package.json` or use:
```powershell
pnpm dev -- -p 3002
```

### API Configuration

The widget needs to connect to the backend API. Make sure:

1. Backend is running on http://localhost:5000
2. CORS is configured in backend to allow http://localhost:3001
3. Widget script can access the API endpoints

---

## 🔍 Troubleshooting

### Widget won't start

**Error: Port 3001 already in use**
```powershell
# Find what's using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
pnpm dev -- -p 3002
```

### Widget can't connect to API

**Check:**
1. Backend is running: http://localhost:5000/swagger
2. CORS settings in backend `appsettings.json`:
   ```json
   "CORS": {
     "Origins": [
       "http://localhost:3000",
       "http://localhost:3001"
     ]
   }
   ```

### Dependencies not installed

```powershell
# Install dependencies
cd frontend
pnpm install

# Or from widget directory
cd frontend\apps\widget
pnpm install
```

---

## 📁 Widget Structure

```
frontend/apps/widget/
├── src/
│   └── app/
│       ├── page.tsx          # Main widget page
│       ├── layout.tsx        # Layout component
│       └── globals.css       # Global styles
├── public/
│   └── widget.js            # Embeddable widget script
├── package.json             # Dependencies and scripts
├── next.config.js          # Next.js configuration
└── tailwind.config.ts      # Tailwind CSS config
```

---

## 🎨 Development Workflow

1. **Start Backend** (Terminal 1):
   ```powershell
   cd backend\src\CustomerSupport.Api
   dotnet watch run
   ```

2. **Start Widget** (Terminal 2):
   ```powershell
   cd frontend\apps\widget
   pnpm dev
   ```

3. **Start Dashboard** (Terminal 3 - Optional):
   ```powershell
   cd frontend\apps\dashboard
   pnpm dev
   ```

4. **Open in Browser:**
   - Widget: http://localhost:3001
   - Dashboard: http://localhost:3000
   - API Docs: http://localhost:5000/swagger

---

## ✅ Quick Checklist

- [ ] Backend API is running (port 5000)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Widget started (`pnpm dev`)
- [ ] Widget accessible at http://localhost:3001
- [ ] CORS configured in backend for port 3001

---

## 🚀 Production Build

To build the widget for production:

```powershell
cd frontend\apps\widget

# Build
pnpm build

# Start production server
pnpm start
```

The production build will be optimized and ready for deployment.

---

**That's it! Your widget should now be running! 🎉**

