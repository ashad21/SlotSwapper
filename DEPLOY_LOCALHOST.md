# 🚀 Deploy SlotSwapper on Localhost

## Your Configuration
- MongoDB URI: `mongodb://localhost:27017/slotswapper`
- JWT Secret: `OoGMDXC2o9pz1RTezmsGl4P1J9K2kXG9`
- Backend Port: `5000`
- Frontend Port: `5174`

---

## ✅ Step-by-Step Deployment

### Step 1: Stop Any Running Servers

If servers are running, press `Ctrl+C` in the terminal to stop them.

### Step 2: Update Environment Files

Run this command in PowerShell:

```powershell
cd d:\Project\SlotSwapper
node fix-env.js
```

**Expected Output:**
```
🔧 Fixing environment files...

✅ Updated backend/.env
   MongoDB URI: mongodb://localhost:27017/slotswapper
✅ Updated frontend/.env

✨ Environment files fixed!
```

### Step 3: Verify MongoDB is Running

```powershell
Get-Service MongoDB
```

**Expected Output:**
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB Server (MongoDB)
```

✅ If Status is "Running", you're good!
❌ If Status is "Stopped", MongoDB is not running (but you said it's already running, so this should be fine)

### Step 4: Start the Application

```powershell
npm run dev
```

**Expected Output:**
```
[0] 🚀 Server running on port 5000
[0] ✅ MongoDB Connected: localhost
[1] ➜  Local:   http://localhost:5174/
```

### Step 5: Open in Browser

Open your browser and go to:
```
http://localhost:5174
```

### Step 6: Test Signup

1. Click "Sign up"
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
3. Click "Create Account"
4. ✅ You should be redirected to the Dashboard!

---

## 🎯 Complete One-Command Deployment

If you want to do everything in one go:

```powershell
# Stop servers (Ctrl+C if running)
# Then run:
cd d:\Project\SlotSwapper
node fix-env.js && npm run dev
```

---

## 📋 Verification Checklist

Before testing, make sure:

- ✅ MongoDB service is running
- ✅ No other app is using port 5000 or 5174
- ✅ Backend shows "MongoDB Connected"
- ✅ Frontend shows "Local: http://localhost:5174/"
- ✅ Browser opens http://localhost:5174

---

## 🔍 Troubleshooting

### Issue: "Signup failed" Error

**Check Backend Terminal:**
Look for these messages:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

If you see errors, common causes:
1. MongoDB not connected
2. Wrong MongoDB URI
3. Port already in use

**Solution:**
```powershell
# Stop servers (Ctrl+C)
node fix-env.js
npm run dev
```

### Issue: Port Already in Use

**Find what's using the port:**
```powershell
netstat -ano | findstr :5000
```

**Kill the process:**
```powershell
taskkill /PID <PID> /F
```

### Issue: MongoDB Connection Error

Your MongoDB is already running, but if you get connection errors:

```powershell
# Check MongoDB status
Get-Service MongoDB

# If stopped, start it (run PowerShell as Administrator)
Start-Service MongoDB
```

### Issue: CORS Error in Browser Console

Press F12 in browser, check Console tab. If you see CORS errors:

**Solution:** Make sure `CLIENT_URL` in backend/.env matches your frontend URL:
```
CLIENT_URL=http://localhost:5174
```

---

## 🎉 Success Indicators

When everything is working correctly:

### Backend Terminal:
```
[0] 🚀 Server running on port 5000
[0] ✅ MongoDB Connected: localhost
[0] Socket.io initialized
```

### Frontend Terminal:
```
[1] VITE v5.4.21  ready in 365 ms
[1] ➜  Local:   http://localhost:5174/
```

### Browser:
- ✅ Beautiful SlotSwapper login/signup page loads
- ✅ No "Signup failed" error
- ✅ Can create account successfully
- ✅ Redirects to Dashboard after signup
- ✅ Can see "Welcome back, [Your Name]!" in header

---

## 📱 Using the Application

### Create Your First Event:

1. Go to Dashboard
2. Click "Add Event" button
3. Fill in:
   - Title: "Team Meeting"
   - Start Time: Select date/time
   - End Time: Select date/time
4. Click "Create"

### Mark Event as Swappable:

1. Find your event in "My Calendar" tab
2. Click "Mark as Swappable"
3. Event status changes to green "SWAPPABLE" badge

### Test Swap Functionality:

1. Open another browser (or incognito window)
2. Go to http://localhost:5174
3. Create a second user account
4. Create and mark events as swappable
5. Go to "Marketplace" tab to see available slots
6. Request a swap
7. Check "Requests" tab in first user's browser
8. Accept/reject the swap
9. See real-time notifications! 🔔

---

## 🛑 Stopping the Application

Press `Ctrl+C` in the terminal where `npm run dev` is running.

---

## 🔄 Restarting After Changes

If you make code changes:

**Backend changes:**
- Server auto-restarts (ts-node-dev)
- No action needed

**Frontend changes:**
- Vite HMR auto-updates
- No action needed

**Environment variable changes:**
```powershell
# Stop servers (Ctrl+C)
node fix-env.js
npm run dev
```

---

## 📊 Your Environment Configuration

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=OoGMDXC2o9pz1RTezmsGl4P1J9K2kXG9
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5174
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🎯 Quick Reference Commands

```powershell
# Setup environment files
node fix-env.js

# Start application
npm run dev

# Stop application
Ctrl+C

# Check MongoDB
Get-Service MongoDB

# Check what's using port 5000
netstat -ano | findstr :5000

# Open application
http://localhost:5174
```

---

## ✨ You're All Set!

Your SlotSwapper application is now deployed on localhost with your specific configuration!

**Access URLs:**
- 🌐 Frontend: http://localhost:5174
- 🔌 Backend API: http://localhost:5000/api
- 💓 Health Check: http://localhost:5000/api/health

**Features Available:**
- ✅ User Authentication (Signup/Login)
- ✅ Calendar Management
- ✅ Event Creation
- ✅ Swap Requests
- ✅ Real-time Notifications
- ✅ Beautiful Modern UI

**Enjoy using SlotSwapper! 🔄**
