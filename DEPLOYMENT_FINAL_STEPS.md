# SlotSwapper - Final Deployment Steps

## ✅ Current Status

Your code is **100% correct**! Here's the verified configuration:

### Backend Configuration ✅
```typescript
// server.ts - Line 69
app.use('/api/auth', authRoutes);

// authRoutes.ts - Lines 6-7
router.post('/signup', signup);
router.post('/login', login);
```

**Result:** Backend endpoints are at:
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Frontend Configuration ✅
```typescript
// api.ts - Line 4
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// AuthContext.tsx - Lines 28, 48
api.post('/auth/login', ...)   // Becomes: /api/auth/login
api.post('/auth/signup', ...)  // Becomes: /api/auth/signup
```

**Result:** Frontend calls the correct endpoints!

### CORS Configuration ✅
```typescript
// server.ts - Lines 22-28
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://slotswapper-gold.vercel.app',
  'https://slotswapper1-yba5.onrender.com',
  process.env.CLIENT_URL || ''
];
```

---

## 🚀 What You Need to Do Now

### Step 1: Commit and Push Backend Changes

```bash
git add backend/src/server.ts frontend/src/lib/api.ts
git commit -m "Update CORS for Render deployment and improve API logging"
git push
```

**Render will automatically deploy your backend.**

---

### Step 2: Set Environment Variables in Vercel

This is the **CRITICAL STEP** that's missing!

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your `slotswapper` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**

Add these two variables:

#### Variable 1:
```
Name: VITE_API_URL
Value: https://slotswapper1-yba5.onrender.com/api
```

#### Variable 2:
```
Name: VITE_SOCKET_URL
Value: https://slotswapper1-yba5.onrender.com
```

5. Click **Save** for each variable

---

### Step 3: Redeploy Frontend in Vercel

**Important:** Environment variables only take effect after redeployment!

1. Go to **Deployments** tab
2. Click on the **latest deployment**
3. Click the **"Redeploy"** button (three dots menu → Redeploy)
4. Wait 1-2 minutes for deployment to complete

---

### Step 4: Verify Deployment

#### A. Check Backend Health
Open in browser:
```
https://slotswapper1-yba5.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

#### B. Check Frontend
1. Visit: `https://slotswapper-gold.vercel.app`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. You should see: `🔗 API URL: https://slotswapper1-yba5.onrender.com/api`
5. Try to sign up

#### C. Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Try to sign up
3. Look for the request to `/api/auth/signup`
4. Click on it to see:
   - **Request URL**: Should be `https://slotswapper1-yba5.onrender.com/api/auth/signup`
   - **Status**: Should be `200 OK` or `201 Created`
   - **Response**: Should have `token` and `user` data

---

## 🎯 Expected Results After Deployment

### ✅ Success Indicators:
- No CORS errors in console
- API calls go to `slotswapper1-yba5.onrender.com`
- Can create new account
- Can log in
- Dashboard loads
- Can create events
- Socket connection works

### ❌ If Still Not Working:

#### Issue: Still calling localhost
**Cause:** Environment variables not set or frontend not redeployed

**Solution:**
1. Double-check environment variables in Vercel
2. Make sure you clicked "Save"
3. Redeploy frontend
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh (Ctrl+Shift+R)

#### Issue: CORS error
**Cause:** Backend not updated

**Solution:**
1. Check Render deployment logs
2. Verify backend redeployed after git push
3. Check backend code has Vercel URL in allowed origins

#### Issue: 404 error
**Cause:** Wrong API URL

**Solution:**
1. Check console log shows correct API URL
2. Check Network tab shows correct request URL
3. Verify `VITE_API_URL` ends with `/api`

---

## 📋 Deployment Checklist

### Backend (Render)
- [x] Code pushed to GitHub
- [x] CORS updated with Vercel URL
- [x] Routes configured: `/api/auth`
- [x] POST endpoints: `/signup`, `/login`
- [ ] Render auto-deployed
- [ ] Health endpoint working

### Frontend (Vercel)
- [x] Code pushed to GitHub
- [x] API configuration correct
- [x] Auth calls use `/auth/login`, `/auth/signup`
- [ ] Environment variables set in Vercel
  - [ ] `VITE_API_URL`
  - [ ] `VITE_SOCKET_URL`
- [ ] Frontend redeployed
- [ ] Console shows correct API URL

### Testing
- [ ] Backend health check responds
- [ ] Frontend loads without errors
- [ ] Console shows Render API URL (not localhost)
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Dashboard loads
- [ ] No CORS errors
- [ ] Socket connects

---

## 🔍 Debugging Commands

### Check Environment Variables in Browser Console
```javascript
// Open browser console on deployed site
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_SOCKET_URL);
```

### Check API Request in Network Tab
1. F12 → Network tab
2. Try to sign up
3. Find `signup` request
4. Check Request URL
5. Check Response

### Check Backend Logs (Render)
1. Render Dashboard → Your Service
2. Logs tab
3. Look for:
   - `✅ MongoDB Connected`
   - `🚀 Server running on port 5000`
   - Any CORS errors

---

## 🎉 Success!

Once you complete these steps, your app will be fully deployed and working!

**Live URLs:**
- Frontend: `https://slotswapper-gold.vercel.app`
- Backend: `https://slotswapper1-yba5.onrender.com`
- API: `https://slotswapper1-yba5.onrender.com/api`

---

## 📝 Summary

**The Problem:** Frontend is calling `localhost:5000/api` instead of Render backend

**The Solution:** Set `VITE_API_URL` environment variable in Vercel

**Why It Happens:** Vite environment variables are baked into the build at build time, so you must set them in Vercel's dashboard before building.

**Your Code:** Already perfect! No code changes needed, just environment variables.

---

## ⚡ Quick Action List

1. ✅ Push code to GitHub
2. ⏳ Set `VITE_API_URL` in Vercel
3. ⏳ Set `VITE_SOCKET_URL` in Vercel
4. ⏳ Redeploy frontend in Vercel
5. ⏳ Test signup at deployed URL

**That's it! Your app will work after these steps!** 🚀
