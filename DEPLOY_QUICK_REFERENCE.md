# ⚡ Quick Deployment Reference

## 🎯 Choose Your Deployment Method

### Method 1: Separate (Recommended) ⭐
**Backend on Render + Frontend on Netlify**

### Method 2: Monorepo
**Everything on Render**

---

## 📋 Method 1: Separate Deployment

### Backend (Render):

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Environment** | Node |

**Environment Variables:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.netlify.app
```

### Frontend (Netlify):

| Setting | Value |
|---------|-------|
| **Base Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

## 📋 Method 2: Monorepo Deployment

### Render (Single Service):

| Setting | Value |
|---------|-------|
| **Root Directory** | (empty) |
| **Build Command** | `npm install && cd backend && npm install && npm run build:full` |
| **Start Command** | `cd backend && NODE_ENV=production npm start` |
| **Environment** | Node |

**Environment Variables:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
CLIENT_URL=https://your-app.onrender.com
```

---

## 🔑 Generate JWT Secret

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🗄️ MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Network Access → Add IP: `0.0.0.0/0`
4. Get connection string
5. Replace `<password>` with your password

---

## ✅ Verification URLs

**Backend Health Check:**
```
https://your-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

**Frontend:**
```
https://your-frontend.netlify.app
```

---

## 🐛 Quick Fixes

### CORS Error:
```
Update CLIENT_URL in backend to match frontend URL exactly
```

### MongoDB Connection Error:
```
1. Check MONGODB_URI is correct
2. Whitelist 0.0.0.0/0 in MongoDB Atlas
3. Verify username/password
```

### Build Failed:
```
1. Check build logs
2. Ensure all dependencies in package.json
3. Verify Node version (18+)
```

---

## 📝 Deployment Order

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy Backend on Render
3. ✅ Copy backend URL
4. ✅ Deploy Frontend on Netlify (use backend URL)
5. ✅ Copy frontend URL
6. ✅ Update backend CLIENT_URL
7. ✅ Test everything

---

## 🎉 Done!

Your app is live! Test all features:
- ✅ Signup/Login
- ✅ Create events
- ✅ Request swaps
- ✅ Accept/Reject
- ✅ Real-time updates

---

**Need detailed instructions? See `DEPLOYMENT_COMPLETE_GUIDE.md`**
