# SlotSwapper - Railway Deployment Guide

This guide will help you deploy SlotSwapper to Railway with separate backend and frontend services.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Architecture

SlotSwapper uses a **two-service architecture**:
- **Backend Service**: Express + TypeScript + MongoDB + Socket.io
- **Frontend Service**: React + Vite (served via Express)

Both services are deployed separately on Railway and communicate via HTTP/WebSocket.

---

## Part 1: Setup MongoDB Atlas

1. **Create a MongoDB Atlas Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free M0 tier is sufficient)
   - Wait for cluster creation (2-3 minutes)

2. **Configure Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Create a user with username and password
   - Grant "Read and write to any database" permissions
   - **Save the username and password** (you'll need them)

3. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Railway to connect to your database

4. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority`

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Backend Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your SlotSwapper repository
4. Railway will detect your project

### Step 2: Configure Backend Service

1. **Set Root Directory**:
   - Go to Service Settings → "Root Directory"
   - Set to: `backend`

2. **Configure Build Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Step 3: Set Environment Variables

Go to "Variables" tab and add these:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-app.railway.app
```

**Important Notes**:
- Replace `MONGO_URI` with your actual MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (use a password generator)
- `CLIENT_URL` will be set after deploying frontend (come back to this)
- Railway automatically provides `PORT` variable, but we set it for clarity

### Step 4: Deploy Backend

1. Click "Deploy" or push to your repository
2. Wait for deployment to complete (2-5 minutes)
3. Once deployed, you'll see a URL like: `https://slotswapper-backend-production.up.railway.app`
4. **Save this URL** - you'll need it for frontend configuration

### Step 5: Verify Backend Deployment

Visit: `https://your-backend-url.railway.app/api/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Part 3: Deploy Frontend to Railway

### Step 1: Create Frontend Service

1. In Railway Dashboard, click "New Service" in your project
2. Select "Deploy from GitHub repo" → Choose same repository
3. Railway will create a second service

### Step 2: Configure Frontend Service

1. **Set Root Directory**:
   - Go to Service Settings → "Root Directory"
   - Set to: `frontend`

2. **Configure Build Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Step 3: Set Environment Variables

Go to "Variables" tab and add these:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

**Important**: Replace with your actual backend URL from Part 2, Step 4.

### Step 4: Deploy Frontend

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://slotswapper-frontend-production.up.railway.app`

### Step 5: Update Backend CORS

1. Go back to **Backend Service** → "Variables"
2. Update `CLIENT_URL` to your frontend URL:
   ```env
   CLIENT_URL=https://your-frontend-url.railway.app
   ```
3. Redeploy backend (it will restart automatically)

---

## Part 4: Verification & Testing

### 1. Test Frontend Access
- Visit your frontend URL
- You should see the SlotSwapper landing page
- Try signing up for a new account

### 2. Test Backend Connection
- Open browser DevTools (F12) → Console
- You should see: `✅ Socket connected`
- No CORS errors should appear

### 3. Test Full Flow
1. **Sign Up**: Create a new account
2. **Login**: Log in with your credentials
3. **Create Event**: Add a calendar event
4. **Create Swap Request**: Request a swap
5. **Real-time Updates**: Open in two browsers to test notifications

---

## Environment Variables Reference

### Backend Variables (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-frontend.railway.app` |

### Frontend Variables (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.railway.app/api` |
| `VITE_SOCKET_URL` | Backend WebSocket URL | `https://your-backend.railway.app` |

---

## Troubleshooting

### Issue: "MONGO_URI is not defined"

**Solution**: 
- Check that `MONGO_URI` is set in Backend Variables
- Ensure there are no extra spaces in the connection string
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Issue: "CORS Error" in Browser Console

**Solution**:
- Verify `CLIENT_URL` in backend matches your frontend URL exactly
- Make sure to include `https://` in the URL
- Redeploy backend after changing `CLIENT_URL`

### Issue: "Failed to connect to MongoDB"

**Solution**:
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify connection string has correct username/password
- Ensure database user has read/write permissions

### Issue: "Socket connection failed"

**Solution**:
- Verify `VITE_SOCKET_URL` matches backend URL
- Check browser console for specific error messages
- Ensure backend is running (check health endpoint)

### Issue: Frontend shows blank page

**Solution**:
- Check Railway build logs for errors
- Verify `dist` folder was created during build
- Check that `server.js` exists in frontend directory

---

## Monitoring & Logs

### View Logs
1. Go to Railway Dashboard → Select Service
2. Click "Deployments" → Select latest deployment
3. View real-time logs

### Common Log Messages

**Backend Success**:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
🌍 Environment: production
```

**Frontend Success**:
```
🚀 Frontend server running on port 3000
📁 Serving static files from: /app/dist
```

---

## Updating Your Deployment

### Update Code
1. Push changes to your Git repository
2. Railway automatically detects changes and redeploys
3. Monitor deployment in Railway dashboard

### Update Environment Variables
1. Go to Service → Variables
2. Update or add variables
3. Service will automatically restart

---

## Cost Estimation

**Railway Pricing** (as of 2024):
- Free tier: $5 credit per month
- Hobby plan: $5/month for additional resources
- Both services (backend + frontend) can run on free tier for development

**MongoDB Atlas**:
- M0 (Free tier): 512 MB storage - Perfect for development/small apps
- M10 (Paid): $0.08/hour - For production apps

---

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (32+ characters, random)
3. **Rotate secrets regularly** in production
4. **Enable MongoDB IP whitelist** for production (instead of 0.0.0.0/0)
5. **Use HTTPS only** (Railway provides this automatically)
6. **Monitor Railway logs** for suspicious activity

---

## Next Steps

After successful deployment:

1. **Custom Domain** (Optional):
   - Go to Service Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Database Backups**:
   - Configure MongoDB Atlas automated backups
   - Set backup schedule in Atlas dashboard

3. **Monitoring**:
   - Set up Railway notifications for deployment failures
   - Monitor MongoDB Atlas metrics

---

## Support

- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **SlotSwapper Issues**: Create an issue in your repository

---

## Quick Reference Commands

### Local Development
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
npm run dev  # from root directory
```

### Manual Build Test
```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

---

**Deployment Complete! 🚀**

Your SlotSwapper application is now live on Railway!
