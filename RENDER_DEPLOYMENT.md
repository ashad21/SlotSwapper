# 🚀 Render Deployment Guide - SlotSwapper

## ❌ Current Error

```
sh: 1: vite: not found
sh: 1: ts-node-dev: not found
```

**Cause:** Dependencies in `backend/` and `frontend/` subdirectories are not being installed.

---

## ✅ Solution Applied

### 1. Fixed Root package.json

Added `postinstall` script to automatically install subdirectory dependencies:

```json
{
  "scripts": {
    "postinstall": "cd backend && npm install && cd ../frontend && npm install",
    "build": "npm run build:backend && npm run build:frontend",
    "start": "cd backend && npm start"
  }
}
```

**What this does:**
- `postinstall`: Runs automatically after `npm install` to install backend and frontend deps
- `build`: Builds both backend (TypeScript → JavaScript) and frontend (Vite build)
- `start`: Starts the production backend server

---

## 🔧 Render Configuration

### Option 1: Deploy Backend Only (Recommended)

**For Backend API:**

1. **Build Command:**
   ```bash
   cd backend && npm install && npm run build
   ```

2. **Start Command:**
   ```bash
   cd backend && npm start
   ```

3. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-secure-secret>
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=<your-frontend-url>
   ```

**For Frontend (Separate Service):**

1. **Build Command:**
   ```bash
   cd frontend && npm install && npm run build
   ```

2. **Publish Directory:**
   ```
   frontend/dist
   ```

3. **Environment Variables:**
   ```
   VITE_API_URL=<your-backend-url>/api
   VITE_SOCKET_URL=<your-backend-url>
   ```

---

### Option 2: Deploy as Monorepo (Current Setup)

**⚠️ Issue:** Running `npm run dev` in production is not recommended.

**Fix Required:**

1. **Change Build Command:**
   ```bash
   npm install && npm run build
   ```

2. **Change Start Command:**
   ```bash
   npm start
   ```

3. **Update Root package.json:**
   ```json
   {
     "scripts": {
       "postinstall": "cd backend && npm install && cd ../frontend && npm install",
       "build": "cd backend && npm run build && cd ../frontend && npm run build",
       "start": "cd backend && npm start"
     }
   }
   ```

---

## 🗄️ MongoDB Setup

### Use MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all for Render)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
   ```
6. Add to Render environment variables as `MONGODB_URI`

---

## 📝 Step-by-Step Deployment

### Step 1: Prepare Repository

1. **Commit the fixed package.json:**
   ```bash
   git add package.json
   git commit -m "Fix: Add postinstall script for Render deployment"
   git push origin main
   ```

### Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `slotswapper-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-super-secret-key-change-this
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```

6. Click "Create Web Service"

### Step 3: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name:** `slotswapper-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. Click "Create Static Site"

### Step 4: Update CORS

After deployment, update backend CORS to allow your frontend URL:

**backend/src/server.ts:**
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));
```

---

## 🔒 Security Checklist

Before deploying:

- [ ] Generate strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Don't commit .env files
- [ ] Whitelist Render IPs in MongoDB Atlas
- [ ] Use HTTPS URLs in production

---

## 🐛 Troubleshooting

### Error: "vite: not found"

**Cause:** Frontend dependencies not installed

**Fix:**
```bash
# In package.json, ensure postinstall script exists
"postinstall": "cd backend && npm install && cd ../frontend && npm install"
```

### Error: "ts-node-dev: not found"

**Cause:** Backend dependencies not installed or using dev command in production

**Fix:**
1. Use `npm start` instead of `npm run dev`
2. Ensure build step runs: `npm run build`

### Error: "Cannot connect to MongoDB"

**Cause:** Using localhost MongoDB URI

**Fix:**
- Use MongoDB Atlas connection string
- Whitelist Render IPs (0.0.0.0/0)

### Error: "CORS policy blocked"

**Cause:** Frontend URL not in CORS whitelist

**Fix:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://your-frontend.onrender.com'
  ],
  credentials: true
}));
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Render Platform                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │  Static Site     │  │ Web Service │ │
│  │  (Frontend)      │  │  (Backend)  │ │
│  │                  │  │             │ │
│  │  React + Vite    │  │  Express    │ │
│  │  Port: 443       │  │  Port: 5000 │ │
│  └────────┬─────────┘  └──────┬──────┘ │
│           │                   │        │
│           │    API Calls      │        │
│           └──────────────────>│        │
│                               │        │
└───────────────────────────────┼────────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │  MongoDB Atlas    │
                    │  (Cloud Database) │
                    └───────────────────┘
```

---

## 🎯 Recommended Approach

### For Production:

**Deploy Backend and Frontend Separately:**

1. **Backend:** Render Web Service
   - Handles API requests
   - Connects to MongoDB Atlas
   - Runs on Node.js

2. **Frontend:** Render Static Site or Netlify
   - Serves React app
   - Calls backend API
   - Fast CDN delivery

**Benefits:**
- ✅ Better performance
- ✅ Independent scaling
- ✅ Easier debugging
- ✅ Free tier available

---

## 📝 Quick Fix for Current Error

**Immediate fix to make deployment work:**

1. **Update root package.json** (already done):
   ```json
   {
     "scripts": {
       "postinstall": "cd backend && npm install && cd ../frontend && npm install"
     }
   }
   ```

2. **Push to GitHub:**
   ```bash
   git add package.json
   git commit -m "Fix: Add postinstall for dependencies"
   git push
   ```

3. **In Render, change Start Command to:**
   ```bash
   cd backend && npm start
   ```

4. **Ensure Build Command is:**
   ```bash
   npm install && cd backend && npm run build
   ```

---

## ✅ Verification

After deployment:

- [ ] Backend URL responds: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Can create account
- [ ] Can login
- [ ] Can create events
- [ ] Can request swaps
- [ ] Socket.io works (real-time notifications)

---

## 🎉 Summary

**Problem:** Dependencies not installed in subdirectories

**Solution:** Added `postinstall` script to root package.json

**Next Steps:**
1. Commit and push changes
2. Deploy backend and frontend separately on Render
3. Use MongoDB Atlas for database
4. Configure environment variables
5. Test all features

**Your SlotSwapper app is ready for production deployment!** 🚀
