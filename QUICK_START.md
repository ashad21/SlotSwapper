# 🚀 QUICK START - One Command Setup

## MongoDB is Already Running ✅

Good news! Your MongoDB service is already running. Now let's set up the application.

## One-Command Setup

Run these commands in PowerShell (in the root directory):

```powershell
# Navigate to project root
cd d:\Project\SlotSwapper

# Step 1: Create environment files and install dependencies
npm run setup

# Step 2: Start both backend and frontend together
npm run dev
```

That's it! The application will start on http://localhost:5173

## Manual Setup (If npm run setup fails)

### Create Backend .env File

```powershell
cd d:\Project\SlotSwapper\backend

@"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_secret_key_here_change_this_to_random_string
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

### Create Frontend .env File

```powershell
cd d:\Project\SlotSwapper\frontend

@"
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding utf8
```

### Install Dependencies

```powershell
cd d:\Project\SlotSwapper
npm run install-all
```

### Start the Application

```powershell
npm run dev
```

## What This Does

- ✅ Creates `.env` files for both backend and frontend
- ✅ Installs all npm dependencies
- ✅ Starts backend server on port 5000
- ✅ Starts frontend dev server on port 5173
- ✅ Opens your browser automatically

## Troubleshooting

### "Signup failed" Error (like in your screenshot)

This usually means:
1. Backend is not running
2. Backend can't connect to MongoDB
3. Environment variables are missing

**Solution:**
```powershell
# Check if backend is running
# You should see: "Server running on port 5000" and "MongoDB Connected"

# If not, check backend terminal for errors
```

### Port Already in Use

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### MongoDB Connection Error

Your MongoDB is running, but if you get connection errors:
```powershell
# Check MongoDB status
Get-Service MongoDB

# If stopped, start it (run PowerShell as Administrator)
Start-Service MongoDB
```

## Expected Output

When everything is working, you should see:

**Backend Terminal:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
Socket.io initialized
```

**Frontend Terminal:**
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Browser:**
- Beautiful login/signup page
- No "Signup failed" error
- Successful account creation

## Next Steps

1. Open http://localhost:5173
2. Click "Sign up"
3. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. You should be redirected to the dashboard!

---

**Need Help?** Check the backend terminal for error messages.
