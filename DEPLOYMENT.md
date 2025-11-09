# 🚀 SlotSwapper Deployment Guide

This guide covers deploying SlotSwapper to production environments.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables configured for production
- [ ] Frontend build tested locally
- [ ] Backend build tested locally
- [ ] All tests passing
- [ ] Security headers configured
- [ ] CORS origins updated for production domains

## 🌐 Deployment Options

### Option 1: Netlify (Frontend) + Render/Railway (Backend)

#### Frontend Deployment to Netlify

1. **Build the frontend:**
   ```bash
   cd SlotSwapper/frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `cd SlotSwapper/frontend && npm run build`
   - Set publish directory: `SlotSwapper/frontend/dist`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     VITE_SOCKET_URL=https://your-backend-url.com
     ```

#### Backend Deployment to Render/Railway

1. **Configure environment variables:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.netlify.app
   ```

2. **Deploy:**
   - Connect your GitHub repository
   - Set build command: `cd SlotSwapper/backend && npm install && npm run build`
   - Set start command: `cd SlotSwapper/backend && npm start`

### Option 2: Vercel (Frontend) + Heroku (Backend)

#### Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd SlotSwapper/frontend
   vercel --prod
   ```

3. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-app.herokuapp.com/api
   VITE_SOCKET_URL=https://your-app.herokuapp.com
   ```

#### Backend to Heroku

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-app.vercel.app
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

2. **For production with custom domain:**
   - Update `docker-compose.yml` with production environment variables
   - Configure reverse proxy (Nginx/Caddy) for SSL
   - Set up domain DNS records

## 🔐 Production Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-random-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## 🛡️ Security Checklist

- [ ] Strong JWT secret (minimum 32 characters)
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured with specific origins (no wildcards)
- [ ] MongoDB connection uses authentication
- [ ] Environment variables not committed to git
- [ ] Rate limiting enabled on API endpoints
- [ ] Helmet.js security headers configured
- [ ] Input validation on all endpoints

## 📊 Monitoring & Logging

### Recommended Tools

- **Backend Monitoring:** New Relic, Datadog, or PM2
- **Error Tracking:** Sentry
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Log Management:** Loggly, Papertrail

### Enable Production Logging

Update `backend/src/server.ts`:
```typescript
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add your deployment steps
```

## 🧪 Post-Deployment Testing

1. **Test Authentication:**
   ```bash
   curl -X POST https://your-api.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

2. **Test Health Endpoint:**
   ```bash
   curl https://your-api.com/api/health
   ```

3. **Test Frontend:**
   - Visit your frontend URL
   - Test signup/login flow
   - Create an event
   - Test swap functionality
   - Verify real-time notifications

## 🔧 Troubleshooting

### Common Issues

**CORS Errors:**
- Verify `CLIENT_URL` in backend .env matches frontend domain
- Check CORS configuration in `backend/src/server.ts`

**MongoDB Connection Failed:**
- Verify MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0 for cloud deployments)
- Check connection string format
- Ensure database user has correct permissions

**WebSocket Connection Failed:**
- Verify `VITE_SOCKET_URL` matches backend domain
- Check if hosting provider supports WebSockets
- Enable WebSocket support in reverse proxy if using one

**Build Failures:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (v18+)
- Verify all environment variables are set

## 📈 Performance Optimization

### Frontend
- Enable Vite build optimizations
- Configure CDN for static assets
- Enable gzip compression
- Implement code splitting

### Backend
- Enable MongoDB connection pooling
- Implement Redis caching for frequent queries
- Use PM2 cluster mode for load balancing
- Enable compression middleware

## 🔄 Database Backup

### MongoDB Atlas Automated Backups
- Enable continuous backup in Atlas dashboard
- Set backup retention period
- Test restore procedure

### Manual Backup
```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/slotswapper"
```

## 📞 Support

For deployment issues:
1. Check logs in your hosting platform dashboard
2. Review this deployment guide
3. Check GitHub Issues
4. Contact support

---

**Happy Deploying! 🚀**
