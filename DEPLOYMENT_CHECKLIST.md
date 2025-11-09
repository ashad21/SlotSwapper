# SlotSwapper Deployment Checklist

Use this checklist to ensure everything is ready for Railway deployment.

## ✅ Pre-Deployment Checklist

### Backend Checklist

- [x] **package.json** has correct scripts:
  - [x] `"build": "tsc"`
  - [x] `"start": "node dist/server.js"`
  - [x] `"dev": "ts-node-dev --respawn --transpile-only src/server.ts"`

- [x] **tsconfig.json** exists with:
  - [x] `"outDir": "./dist"`
  - [x] `"rootDir": "./src"`

- [x] **src/server.ts** or **src/index.ts**:
  - [x] Uses `process.env.PORT` for server port
  - [x] Awaits database connection before starting server
  - [x] Has proper error handling for DB connection
  - [x] CORS configured with `process.env.CLIENT_URL`

- [x] **src/config/database.ts**:
  - [x] Loads `dotenv` at the top
  - [x] Checks for `MONGO_URI` or `MONGODB_URI`
  - [x] Exits with error if URI is undefined
  - [x] Provides clear error messages

- [x] **.env.example** exists with:
  - [x] `PORT=5000`
  - [x] `MONGO_URI=mongodb://...`
  - [x] `JWT_SECRET=...`
  - [x] `CLIENT_URL=http://localhost:5173`
  - [x] No actual secrets (only examples)

- [x] **Dependencies**:
  - [x] `dotenv` installed
  - [x] `mongoose` installed
  - [x] `express` installed
  - [x] `cors` installed

### Frontend Checklist

- [x] **package.json** has correct scripts:
  - [x] `"build": "tsc && vite build"`
  - [x] `"start": "node server.js"`
  - [x] `"dev": "vite"`

- [x] **server.js** exists in root:
  - [x] Uses ES modules (`import` syntax)
  - [x] Serves static files from `dist/`
  - [x] Handles SPA routing (serves index.html for all routes)
  - [x] Uses `process.env.PORT`

- [x] **API Configuration**:
  - [x] Uses `import.meta.env.VITE_API_URL` for API calls
  - [x] Uses `import.meta.env.VITE_SOCKET_URL` for WebSocket
  - [x] Has fallback to localhost for development

- [x] **.env.example** exists with:
  - [x] `VITE_API_URL=http://localhost:5000/api`
  - [x] `VITE_SOCKET_URL=http://localhost:5000`

- [x] **Dependencies**:
  - [x] `express` in dependencies (not devDependencies)
  - [x] All required packages installed

### Repository Checklist

- [ ] **.gitignore** includes:
  - [ ] `.env`
  - [ ] `node_modules/`
  - [ ] `dist/`
  - [ ] `build/`

- [ ] **No sensitive data** in repository:
  - [ ] No `.env` files committed
  - [ ] No API keys in code
  - [ ] No passwords in code

- [ ] **Documentation**:
  - [ ] README.md with project description
  - [ ] RAILWAY_DEPLOYMENT.md with deployment steps
  - [ ] .env.example files in both backend and frontend

## 🚀 Railway Deployment Steps

### Step 1: MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created a cluster (M0 free tier)
- [ ] Created database user with password
- [ ] Added IP whitelist: 0.0.0.0/0 (allow all)
- [ ] Copied connection string
- [ ] Replaced `<password>` in connection string
- [ ] Added database name to connection string

### Step 2: Deploy Backend
- [ ] Created new Railway project
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGO_URI=<your_mongodb_uri>`
  - [ ] `JWT_SECRET=<strong_random_secret>`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `CLIENT_URL=<will_add_after_frontend>`
- [ ] Deployed successfully
- [ ] Saved backend URL
- [ ] Tested health endpoint: `/api/health`

### Step 3: Deploy Frontend
- [ ] Created new service in same Railway project
- [ ] Connected same GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Added environment variables:
  - [ ] `VITE_API_URL=<backend_url>/api`
  - [ ] `VITE_SOCKET_URL=<backend_url>`
- [ ] Deployed successfully
- [ ] Saved frontend URL

### Step 4: Update Backend CORS
- [ ] Went back to backend service
- [ ] Updated `CLIENT_URL` to frontend URL
- [ ] Redeployed backend

### Step 5: Testing
- [ ] Visited frontend URL
- [ ] Landing page loads correctly
- [ ] No CORS errors in console
- [ ] Socket connection successful
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can create events
- [ ] Can create swap requests
- [ ] Real-time notifications work

## 🔍 Verification Commands

### Test Backend Locally
```bash
cd backend
npm install
npm run build
npm start
# Visit http://localhost:5000/api/health
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run build
npm start
# Visit http://localhost:3000
```

### Test Full Stack Locally
```bash
# From root directory
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

## 🐛 Common Issues & Solutions

### Backend won't start
- [ ] Check Railway logs for errors
- [ ] Verify `MONGO_URI` is set correctly
- [ ] Ensure `dist/server.js` was created during build
- [ ] Check MongoDB Atlas IP whitelist

### Frontend shows blank page
- [ ] Check Railway logs for build errors
- [ ] Verify `dist/` folder was created
- [ ] Check `server.js` exists
- [ ] Verify environment variables are set

### CORS errors
- [ ] Verify `CLIENT_URL` matches frontend URL exactly
- [ ] Include `https://` in URLs
- [ ] Redeploy backend after changing CORS settings

### Database connection fails
- [ ] Check MongoDB Atlas is running
- [ ] Verify connection string format
- [ ] Check database user permissions
- [ ] Ensure IP whitelist includes 0.0.0.0/0

### Socket.io not connecting
- [ ] Verify `VITE_SOCKET_URL` is correct
- [ ] Check backend WebSocket configuration
- [ ] Look for errors in browser console

## 📊 Post-Deployment

### Monitoring
- [ ] Set up Railway deployment notifications
- [ ] Monitor MongoDB Atlas metrics
- [ ] Check application logs regularly

### Security
- [ ] Rotate JWT secret periodically
- [ ] Review MongoDB access logs
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities

### Performance
- [ ] Monitor Railway resource usage
- [ ] Check MongoDB query performance
- [ ] Optimize slow API endpoints
- [ ] Consider upgrading plans if needed

### Backup
- [ ] Configure MongoDB Atlas automated backups
- [ ] Test backup restoration process
- [ ] Document backup procedures

## ✨ Optional Enhancements

- [ ] Add custom domain to Railway services
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring/analytics (e.g., Sentry)
- [ ] Configure email notifications
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Set up staging environment

---

**Checklist Complete! Your SlotSwapper app is production-ready! 🎉**
