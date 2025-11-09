# SlotSwapper - Vercel Deployment Troubleshooting

## Issue: "Signup failed" Error

When you see "Signup failed" on your deployed Vercel app, it means the frontend cannot communicate with the backend API.

---

## Quick Diagnosis Steps

### Step 1: Open Browser Console (F12)

1. Open your deployed site: `https://slotswapper-gold.vercel.app/signup`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to sign up again
5. Look for error messages (they will be red)

**Common errors you might see:**
- `Failed to fetch` → Backend URL is wrong or backend is down
- `CORS error` → Backend CORS not configured for your frontend URL
- `Network Error` → Backend is not accessible
- `404 Not Found` → API endpoint doesn't exist
- `500 Internal Server Error` → Backend has an error

### Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Try to sign up again
3. Look for the API request (usually `/api/auth/signup`)
4. Click on it to see:
   - **Request URL**: Should point to your backend
   - **Status Code**: Should be 200 for success
   - **Response**: Error message from backend

---

## Common Issues & Solutions

### Issue 1: Frontend Environment Variables Not Set

**Symptom**: API calls go to `http://localhost:5000/api` instead of your backend URL

**Solution**: Set environment variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `slotswapper` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

5. **Redeploy** your frontend (Vercel → Deployments → Redeploy)

---

### Issue 2: Backend CORS Not Configured

**Symptom**: Console shows CORS error like:
```
Access to XMLHttpRequest at 'https://backend.railway.app/api/auth/signup' 
from origin 'https://slotswapper-gold.vercel.app' has been blocked by CORS policy
```

**Solution**: Update backend CORS configuration

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your **backend service**
3. Go to **Variables**
4. Update `CLIENT_URL`:

```
CLIENT_URL=https://slotswapper-gold.vercel.app
```

5. Backend will automatically redeploy
6. Wait 1-2 minutes for deployment to complete

---

### Issue 3: Backend Not Deployed or Down

**Symptom**: 
- Network error
- Cannot reach backend URL
- Timeout errors

**Solution**: Check backend deployment

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your **backend service**
3. Check deployment status (should be green/active)
4. Click on **Deployments** → View latest deployment logs
5. Look for errors in logs

**Common backend errors:**
- `MONGO_URI is not defined` → Set MongoDB connection string
- `Port already in use` → Railway will handle this automatically
- `Module not found` → Build failed, check build logs

---

### Issue 4: MongoDB Connection Failed

**Symptom**: Backend logs show:
```
❌ MongoDB connection error
```

**Solution**: Check MongoDB Atlas configuration

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Check cluster is running (green status)
3. Go to **Database Access** → Verify user exists
4. Go to **Network Access** → Verify `0.0.0.0/0` is allowed
5. Copy connection string again
6. Update `MONGO_URI` in Railway backend variables
7. Redeploy backend

---

## Step-by-Step Fix Guide

### For Vercel Frontend:

1. **Check Environment Variables**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   
   Required:
   - VITE_API_URL = https://your-backend.railway.app/api
   - VITE_SOCKET_URL = https://your-backend.railway.app
   ```

2. **Redeploy Frontend**
   ```
   Vercel Dashboard → Deployments → Latest → Redeploy
   ```

3. **Wait for deployment** (1-2 minutes)

4. **Test again**

### For Railway Backend:

1. **Check Environment Variables**
   ```
   Railway Dashboard → Backend Service → Variables
   
   Required:
   - NODE_ENV = production
   - PORT = 5000
   - MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/slotswapper
   - JWT_SECRET = your_secret_key
   - CLIENT_URL = https://slotswapper-gold.vercel.app
   ```

2. **Check Deployment Status**
   ```
   Railway Dashboard → Backend Service → Deployments
   - Should show "Active" or "Success"
   - Click to view logs
   ```

3. **Check Logs for Errors**
   ```
   Look for:
   ✅ MongoDB Connected: cluster0-shard-00-00...
   🚀 Server running on port 5000
   ```

4. **Test Backend Health**
   ```
   Visit: https://your-backend.railway.app/api/health
   
   Should return:
   {
     "success": true,
     "message": "Server is running",
     "environment": "production"
   }
   ```

---

## Testing Checklist

After making changes, test in this order:

- [ ] Backend health endpoint responds: `https://backend-url/api/health`
- [ ] Frontend loads without console errors
- [ ] Network tab shows API requests going to correct backend URL
- [ ] No CORS errors in console
- [ ] Signup form submits without errors
- [ ] Can create an account successfully
- [ ] Can log in with created account
- [ ] Dashboard loads after login

---

## Getting More Information

### View Backend Logs (Railway)
```
Railway Dashboard → Backend Service → Deployments → Latest → View Logs
```

### View Frontend Logs (Vercel)
```
Vercel Dashboard → Your Project → Deployments → Latest → View Function Logs
```

### View Browser Console
```
1. Open deployed site
2. Press F12
3. Go to Console tab
4. Try the action that fails
5. Copy error messages
```

---

## Still Having Issues?

If you're still seeing errors, collect this information:

1. **Backend URL**: `https://your-backend.railway.app`
2. **Frontend URL**: `https://slotswapper-gold.vercel.app`
3. **Backend Health Check**: Visit backend-url/api/health and copy response
4. **Browser Console Error**: Copy the exact error message
5. **Network Tab**: Screenshot of failed API request
6. **Backend Logs**: Copy last 20 lines from Railway logs

---

## Quick Fix Commands

### Redeploy Everything
```bash
# 1. Update environment variables in both Vercel and Railway
# 2. Redeploy backend (Railway will auto-redeploy on variable change)
# 3. Redeploy frontend in Vercel dashboard
```

### Test Backend Locally
```bash
cd backend
npm install
npm run build
npm start
# Visit http://localhost:5000/api/health
```

### Test Frontend Locally with Production Backend
```bash
cd frontend
# Create .env.local file:
echo "VITE_API_URL=https://your-backend.railway.app/api" > .env.local
echo "VITE_SOCKET_URL=https://your-backend.railway.app" >> .env.local
npm run dev
# Visit http://localhost:5173
```

---

## Most Common Solution

**90% of the time, the issue is:**

1. `VITE_API_URL` not set in Vercel environment variables
2. `CLIENT_URL` not set correctly in Railway backend variables

**Quick fix:**
1. Set `VITE_API_URL` in Vercel to your Railway backend URL + `/api`
2. Set `CLIENT_URL` in Railway to your Vercel frontend URL
3. Redeploy both services
4. Wait 2 minutes
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try again

---

**Need more help?** Check the deployment logs and browser console for specific error messages.
