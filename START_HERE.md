# 🚀 START HERE - Quick Launch Guide

## Copy & Paste These Commands to Get Started!

### Step 1: Install Dependencies (Run in PowerShell)

```powershell
# Navigate to project
cd d:\Project\SlotSwapper

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Create Environment Files

**Backend Environment:**
```powershell
cd backend
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=slotswapper_secret_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
cd ..
```

**Frontend Environment:**
```powershell
cd frontend
@"
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding utf8
cd ..
```

### Step 3: Start MongoDB

**Option A: If MongoDB is installed locally**
```powershell
# Check if MongoDB is running
mongosh
# If it connects, you're good! Press Ctrl+C to exit
```

**Option B: Use MongoDB Atlas (Free Cloud Database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend\.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
   ```

### Step 4: Launch the Application

**Open TWO PowerShell windows:**

**Window 1 - Backend:**
```powershell
cd d:\Project\SlotSwapper\backend
npm run dev
```

**Window 2 - Frontend:**
```powershell
cd d:\Project\SlotSwapper\frontend
npm run dev
```

### Step 5: Open Your Browser

Go to: **http://localhost:5173**

---

## ✅ Success Checklist

You should see:
- ✅ Backend terminal: `🚀 Server running on port 5000`
- ✅ Backend terminal: `✅ MongoDB Connected`
- ✅ Frontend terminal: `Local: http://localhost:5173/`
- ✅ Browser: Beautiful SlotSwapper login page

---

## 🎯 Quick Test

1. Click **"Sign up"**
2. Create account:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
3. You should be redirected to the Dashboard!

---

## ❌ Troubleshooting

### MongoDB Not Running?
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Start MongoDB service
Start-Service MongoDB
```

### Port 5000 Already in Use?
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### Dependencies Issues?
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Reinstall frontend
cd ..\frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📚 Next Steps

Once the app is running:

1. **Explore the Dashboard**
   - View your calendar
   - Create events
   - Mark slots as swappable

2. **Test Swap Functionality**
   - Open an incognito window
   - Create a second user
   - Request a swap between users
   - See real-time notifications!

3. **Read the Documentation**
   - [README.md](./README.md) - Full project overview
   - [SETUP.md](./SETUP.md) - Detailed setup guide
   - [INSTALLATION_COMMANDS.md](./INSTALLATION_COMMANDS.md) - All commands

---

## 🎉 You're All Set!

The SlotSwapper application is now running with:
- ✅ Beautiful, modern UI
- ✅ User authentication
- ✅ Real-time notifications
- ✅ Calendar management
- ✅ Swap functionality

**Enjoy using SlotSwapper! 🔄**




# Create backend .env
cd d:\Project\SlotSwapper\backend
@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=slotswapper_secret_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8

# Create frontend .env
cd ..\frontend
@"
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding utf8

# Install all dependencies
cd ..
npm install
cd backend
npm install
cd ..\frontend
npm install

# Start the app
cd ..
npm run dev