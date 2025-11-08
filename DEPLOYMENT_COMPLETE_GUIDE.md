# 🚀 Complete Deployment Guide - SlotSwapper

## ✅ All Code Enhanced for Deployment!

### Changes Made:

1. ✅ **Backend server.ts** - Production-ready with static file serving
2. ✅ **Backend package.json** - Enhanced build scripts
3. ✅ **Root package.json** - Postinstall script for dependencies
4. ✅ **netlify.toml** - Netlify configuration
5. ✅ **Environment templates** - Production env examples
6. ✅ **CORS configuration** - Multiple origins support
7. ✅ **Health check endpoint** - Enhanced monitoring

---

## 🎯 Deployment Options

### Option 1: Separate Deployment (Recommended) ⭐

**Backend on Render + Frontend on Netlify**

**Pros:**
- ✅ Best performance
- ✅ Independent scaling
- ✅ Free tier available
- ✅ Easy to debug
- ✅ CDN for frontend

### Option 2: Monorepo Deployment

**Both on Render (Single Service)**

**Pros:**
- ✅ Single deployment
- ✅ Simpler management
- ✅ One URL

---

## 📋 Option 1: Separate Deployment (Step-by-Step)

### Step 1: Deploy Backend on Render

#### 1.1 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user:
   - Username: `slotswapper`
   - Password: Generate strong password
4. Network Access → Add IP: `0.0.0.0/0` (Allow from anywhere)
5. Get connection string:
   ```
   mongodb+srv://slotswapper:<password>@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
   ```

#### 1.2 Deploy Backend

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:

**Service Name:** `slotswapper-backend`

**Root Directory:** `backend`

**Environment:** `Node`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Instance Type:** `Free`

#### 1.3 Add Environment Variables

Click "Environment" tab and add:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://slotswapper:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=<generate-with-command-below>
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-app.netlify.app
```

**Generate JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL: `https://slotswapper-backend.onrender.com`

---

### Step 2: Deploy Frontend on Netlify

#### 2.1 Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:

**Base directory:** `frontend`

**Build command:**
```bash
npm install && npm run build
```

**Publish directory:**
```
dist
```

**Build environment variables:**

Click "Show advanced" → "New variable":

```env
VITE_API_URL=https://slotswapper-backend.onrender.com/api
VITE_SOCKET_URL=https://slotswapper-backend.onrender.com
```

5. Click "Deploy site"
6. Wait for deployment (2-5 minutes)
7. Copy your frontend URL: `https://your-app-name.netlify.app`

#### 2.2 Update Backend Environment

Go back to Render → Your backend service → Environment:

Update `CLIENT_URL`:
```
CLIENT_URL=https://your-app-name.netlify.app
```

Click "Save Changes" → Service will redeploy

---

## 📋 Option 2: Monorepo Deployment (Single Service)

### Deploy Everything on Render

**Build Command:**
```bash
npm install && cd backend && npm install && npm run build:full
```

**Start Command:**
```bash
cd backend && NODE_ENV=production npm start
```

**Environment Variables:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=https://your-render-app.onrender.com
```

**How it works:**
1. Backend builds TypeScript
2. Frontend builds React app
3. Backend serves frontend static files in production
4. Single URL for everything

---

## 🔧 Render Configuration Files

### For Backend Only Deployment:

**Root Directory:** `backend`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### For Monorepo Deployment:

**Root Directory:** (leave empty)

**Build Command:**
```bash
npm install && cd backend && npm install && npm run build:full
```

**Start Command:**
```bash
cd backend && NODE_ENV=production npm start
```

---

## 🌐 Netlify Configuration

The `netlify.toml` file is already created with:

```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**This handles:**
- ✅ SPA routing
- ✅ Build configuration
- ✅ Redirects

---

## ✅ Verification Checklist

### After Backend Deployment:

- [ ] Visit: `https://your-backend.onrender.com/api/health`
- [ ] Should see: `{"success":true,"message":"Server is running"}`
- [ ] Check logs for "MongoDB Connected"
- [ ] No errors in logs

### After Frontend Deployment:

- [ ] Visit: `https://your-frontend.netlify.app`
- [ ] Login page loads
- [ ] Can create account
- [ ] Can login
- [ ] Can create events
- [ ] Can request swaps
- [ ] Real-time notifications work

---

## 🐛 Troubleshooting

### Backend Issues:

**Error: "Cannot connect to MongoDB"**
```
Fix: Check MONGODB_URI is correct
     Whitelist 0.0.0.0/0 in MongoDB Atlas
```

**Error: "CORS policy blocked"**
```
Fix: Update CLIENT_URL in backend environment variables
     Ensure it matches your frontend URL exactly
```

**Error: "Application failed to respond"**
```
Fix: Check logs in Render dashboard
     Ensure PORT environment variable is set
     Verify build completed successfully
```

### Frontend Issues:

**Error: "Failed to fetch"**
```
Fix: Check VITE_API_URL is correct
     Ensure backend is running
     Check browser console for exact error
```

**Error: "WebSocket connection failed"**
```
Fix: Check VITE_SOCKET_URL is correct
     Ensure it matches backend URL
     Backend must support WebSocket connections
```

---

## 📊 Environment Variables Summary

### Backend (.env):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url/api
VITE_SOCKET_URL=https://your-backend-url
```

---

## 🎯 Quick Deploy Commands

### Backend on Render:

```bash
# Build Command
npm install && npm run build

# Start Command
npm start
```

### Frontend on Netlify:

```bash
# Build Command
npm install && npm run build

# Publish Directory
dist
```

### Monorepo on Render:

```bash
# Build Command
npm install && cd backend && npm install && npm run build:full

# Start Command
cd backend && NODE_ENV=production npm start
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Don't commit .env files to Git
- [ ] Use HTTPS URLs only
- [ ] Whitelist only necessary IPs in MongoDB
- [ ] Enable MongoDB authentication
- [ ] Review Helmet.js configuration
- [ ] Set up monitoring/logging

---

## 📈 Post-Deployment

### Monitor Your App:

1. **Render Dashboard:**
   - View logs
   - Monitor CPU/Memory
   - Check uptime

2. **Netlify Dashboard:**
   - View deploy logs
   - Monitor bandwidth
   - Check build times

3. **MongoDB Atlas:**
   - Monitor connections
   - Check database size
   - Review slow queries

---

## 🎉 Success!

Your SlotSwapper application is now deployed and ready for production use!

**Backend:** `https://your-backend.onrender.com`
**Frontend:** `https://your-frontend.netlify.app`

### Test Everything:

1. ✅ Create account
2. ✅ Login
3. ✅ Create events
4. ✅ Mark as swappable
5. ✅ Request swaps
6. ✅ Accept/Reject swaps
7. ✅ Cancel requests
8. ✅ Real-time notifications
9. ✅ Calendar updates

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Your deployment is complete! 🚀**
