# SlotSwapper - Render + Vercel Deployment Guide

## Current Setup
- **Backend**: Deployed on Render at `https://slotswapper1-yba5.onrender.com`
- **Frontend**: Deployed on Vercel at `https://slotswapper-gold.vercel.app`

---

## Fix "Signup Failed" / 404 Error

### Issue
Your frontend is calling `http://localhost:5000/api` instead of your Render backend URL.

### Solution: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `slotswapper` project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

```env
VITE_API_URL=https://slotswapper1-yba5.onrender.com/api
VITE_SOCKET_URL=https://slotswapper1-yba5.onrender.com
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click on the latest deployment → **Redeploy**
8. Wait 1-2 minutes for deployment to complete

---

## Backend Configuration (Render)

### Environment Variables Required

Go to your Render dashboard → Select backend service → Environment

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=https://slotswapper-gold.vercel.app
```

### Build & Start Commands

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

---

## Frontend Configuration (Vercel)

### Environment Variables Required

Go to Vercel dashboard → Your project → Settings → Environment Variables

```env
VITE_API_URL=https://slotswapper1-yba5.onrender.com/api
VITE_SOCKET_URL=https://slotswapper1-yba5.onrender.com
```

### Build Settings

**Framework Preset:** Vite

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
dist
```

**Install Command:**
```bash
npm install
```

---

## Verification Steps

### 1. Test Backend Health
Visit: `https://slotswapper1-yba5.onrender.com/api/health`

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend
1. Visit: `https://slotswapper-gold.vercel.app`
2. Open browser console (F12)
3. Try to sign up
4. Check Network tab - API calls should go to `slotswapper1-yba5.onrender.com`

### 3. Check for Errors
- **No CORS errors** in console
- **No 404 errors** on API calls
- **Socket connection successful**

---

## Common Issues & Solutions

### Issue: Still getting 404 on /auth/signup

**Cause:** Frontend environment variables not set or not redeployed

**Solution:**
1. Verify `VITE_API_URL` is set in Vercel
2. Redeploy frontend in Vercel
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Issue: CORS Error

**Cause:** Backend doesn't allow Vercel frontend URL

**Solution:**
1. Backend code already updated with Vercel URL
2. Commit and push changes:
   ```bash
   git add backend/src/server.ts
   git commit -m "Add Vercel URL to CORS allowed origins"
   git push
   ```
3. Render will auto-deploy (if connected to GitHub)
4. Or manually redeploy in Render dashboard

### Issue: "Cannot connect to backend"

**Cause:** Render backend is sleeping (free tier)

**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- First request wakes it up (takes 30-60 seconds)
- Visit backend health endpoint to wake it up
- Consider upgrading to paid tier for always-on service

### Issue: MongoDB Connection Failed

**Cause:** MongoDB Atlas not configured properly

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. **Network Access** → Add `0.0.0.0/0` (allow all IPs)
3. **Database Access** → Verify user has read/write permissions
4. Copy connection string
5. Update `MONGO_URI` in Render environment variables
6. Redeploy backend

---

## Deployment Checklist

### Backend (Render)
- [x] Code pushed to GitHub
- [x] Render service created and connected to repo
- [x] Environment variables set (MONGO_URI, JWT_SECRET, CLIENT_URL)
- [x] Build command: `npm install && npm run build`
- [x] Start command: `npm start`
- [x] Health endpoint working: `/api/health`
- [x] CORS configured for Vercel URL

### Frontend (Vercel)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected to repo
- [ ] Environment variables set (VITE_API_URL, VITE_SOCKET_URL)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Deployment successful
- [ ] Can access landing page
- [ ] API calls go to Render backend

### Testing
- [ ] Backend health check responds
- [ ] Frontend loads without errors
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Dashboard loads
- [ ] Can create events
- [ ] Can request swaps
- [ ] Real-time notifications work

---

## Quick Commands

### Deploy Backend Changes
```bash
git add .
git commit -m "Update backend configuration"
git push
# Render auto-deploys
```

### Deploy Frontend Changes
```bash
git add .
git commit -m "Update frontend configuration"
git push
# Vercel auto-deploys
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
# Create .env.local
echo "VITE_API_URL=https://slotswapper1-yba5.onrender.com/api" > .env.local
echo "VITE_SOCKET_URL=https://slotswapper1-yba5.onrender.com" >> .env.local
npm run dev
# Visit http://localhost:5173
```

---

## Important Notes

### Render Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- 750 hours/month free (enough for one service)
- Consider paid tier ($7/month) for production

### Vercel Free Tier
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Perfect for frontend hosting

### MongoDB Atlas Free Tier
- 512MB storage
- Shared cluster
- Perfect for development/small apps
- Automatic backups available

---

## Next Steps After Successful Deployment

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update CORS in backend with new domain

2. **Monitoring**
   - Set up Render notifications for deployment failures
   - Monitor MongoDB Atlas metrics
   - Use Vercel analytics

3. **Security**
   - Rotate JWT secret regularly
   - Use strong MongoDB password
   - Enable MongoDB IP whitelist (instead of 0.0.0.0/0)
   - Review CORS allowed origins

4. **Performance**
   - Consider upgrading Render to paid tier
   - Enable MongoDB Atlas connection pooling
   - Optimize API response times

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

## Current Status

✅ Backend CORS updated with Vercel URL  
⏳ Waiting for environment variables to be set in Vercel  
⏳ Waiting for frontend redeploy  

**Next Action:** Set `VITE_API_URL` and `VITE_SOCKET_URL` in Vercel, then redeploy!
