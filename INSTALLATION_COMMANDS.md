# Quick Installation Commands

Copy and paste these commands to get started quickly!

## Step 1: Install All Dependencies

```bash
# Navigate to project root
cd d:\Project\SlotSwapper

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies  
cd frontend
npm install
cd ..
```

## Step 2: Create Environment Files

### Backend Environment

```bash
# Create backend .env file
cd backend
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/slotswapper >> .env
echo JWT_SECRET=slotswapper_secret_key_2024_change_in_production >> .env
echo JWT_EXPIRE=7d >> .env
echo NODE_ENV=development >> .env
echo CLIENT_URL=http://localhost:5173 >> .env
cd ..
```

### Frontend Environment

```bash
# Create frontend .env file
cd frontend
echo VITE_API_URL=http://localhost:5000/api > .env
echo VITE_SOCKET_URL=http://localhost:5000 >> .env
cd ..
```

## Step 3: Start MongoDB

### Option A: MongoDB Locally (Windows)

```bash
# MongoDB should start automatically if installed as a service
# Check if it's running:
mongosh
# If connection successful, MongoDB is running!
```

### Option B: Use MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
   ```

## Step 4: Run the Application

### Open Two Terminals

**Terminal 1 - Backend:**
```bash
cd d:\Project\SlotSwapper\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\Project\SlotSwapper\frontend
npm run dev
```

## Step 5: Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

## Alternative: Docker Setup (If you have Docker installed)

```bash
cd d:\Project\SlotSwapper
docker-compose up --build
```

Then access at http://localhost:5173

---

## Quick Test

1. Go to http://localhost:5173
2. Click "Sign up"
3. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. You should be redirected to the dashboard!

---

## If Something Goes Wrong

### MongoDB Not Running?
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or check if it's installed
mongod --version
```

### Port 5000 Already in Use?
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill that process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Dependencies Issues?
```bash
# Clear cache and reinstall
npm cache clean --force
cd backend
rm -rf node_modules package-lock.json
npm install
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Success! 🎉

If both terminals show no errors and you can access http://localhost:5173, you're all set!

The application features:
- ✅ Beautiful modern UI
- ✅ User authentication
- ✅ Calendar management
- ✅ Real-time swap requests
- ✅ WebSocket notifications
- ✅ Responsive design
