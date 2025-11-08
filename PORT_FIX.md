# 🔧 Port Already in Use - Quick Fix

## ❌ Error
```
Error: listen EADDRINUSE: address already in use :::5000
```

## ✅ Solution

### Quick Fix (Copy-Paste These Commands)

```powershell
# 1. Find process using port 5000
netstat -ano | findstr :5000

# 2. Kill the process (replace XXXX with PID from step 1)
taskkill /PID XXXX /F

# 3. Find process using port 5174 (frontend)
netstat -ano | findstr :5174

# 4. Kill the process (replace YYYY with PID from step 3)
taskkill /PID YYYY /F

# 5. Restart application
npm run dev
```

### One-Line Fix (Automated)

```powershell
# Kill both ports and restart
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /PID %a /F & for /f "tokens=5" %b in ('netstat -ano ^| findstr :5174') do taskkill /PID %b /F & npm run dev
```

## 🔍 Why This Happens

**Cause:** Previous `npm run dev` process didn't stop properly
- Backend still running on port 5000
- Frontend still running on port 5174
- New process can't bind to occupied ports

**Common Triggers:**
- Closing terminal without stopping servers (Ctrl+C)
- IDE crash or force close
- Multiple `npm run dev` commands
- System restart without cleanup

## 📝 Step-by-Step Manual Fix

### Step 1: Find the Process
```powershell
netstat -ano | findstr :5000
```

**Output Example:**
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    26668
                                                  ^^^^^
                                                  This is the PID
```

### Step 2: Kill the Process
```powershell
taskkill /PID 26668 /F
```

**Expected Output:**
```
SUCCESS: The process with PID 26668 has been terminated.
```

### Step 3: Repeat for Frontend Port
```powershell
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Step 4: Restart
```powershell
npm run dev
```

## 🚀 Prevention Tips

### 1. Always Stop Properly
```powershell
# In the terminal running npm run dev:
Ctrl + C

# Wait for "Process terminated" message
```

### 2. Check Before Starting
```powershell
# Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :5174

# If output is empty, ports are free ✅
```

### 3. Create a Restart Script

Create `restart.ps1`:
```powershell
# Kill existing processes
$port5000 = netstat -ano | findstr :5000 | ForEach-Object { $_.Split(' ')[-1] } | Select-Object -First 1
$port5174 = netstat -ano | findstr :5174 | ForEach-Object { $_.Split(' ')[-1] } | Select-Object -First 1

if ($port5000) { taskkill /PID $port5000 /F }
if ($port5174) { taskkill /PID $port5174 /F }

# Wait a moment
Start-Sleep -Seconds 2

# Start servers
npm run dev
```

**Usage:**
```powershell
.\restart.ps1
```

## 🔧 Alternative Solutions

### Solution 1: Change Ports

**Backend** (`backend/.env`):
```env
PORT=5001  # Change from 5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001/api  # Update to match
```

### Solution 2: Use Different Terminal

- Close current terminal completely
- Open new terminal
- Run `npm run dev`

### Solution 3: Restart Computer

If all else fails:
1. Save your work
2. Restart computer
3. Ports will be freed
4. Run `npm run dev`

## 📊 Common Port Issues

| Port | Service | Fix Command |
|------|---------|-------------|
| 5000 | Backend | `taskkill /PID <PID> /F` |
| 5174 | Frontend | `taskkill /PID <PID> /F` |
| 27017 | MongoDB | `Stop-Service MongoDB` |
| 3000 | React (old) | `taskkill /PID <PID> /F` |

## 🎯 Quick Troubleshooting

### Issue: "Access Denied" when killing process
**Solution:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"
taskkill /PID <PID> /F
```

### Issue: Process keeps coming back
**Solution:**
```powershell
# Find parent process
wmic process where processid=<PID> get parentprocessid

# Kill parent process
taskkill /PID <PARENT_PID> /F
```

### Issue: Can't find the PID
**Solution:**
```powershell
# More detailed view
netstat -ano | findstr :5000

# Or use Task Manager
# Ctrl+Shift+Esc → Details tab → Sort by PID
```

## ✅ Verification

After fixing, verify servers are running:

### Check Backend (Port 5000)
```powershell
# Should see "MongoDB Connected"
# Should see "Server running on port 5000"
```

### Check Frontend (Port 5174)
```powershell
# Should see "Local: http://localhost:5174/"
```

### Test in Browser
```
http://localhost:5174
```

**Expected:** Login page loads ✅

## 📝 Summary

**Problem:** Port 5000 already in use
**Cause:** Previous process still running
**Solution:** Kill process and restart

**Commands:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm run dev
```

**Prevention:** Always use Ctrl+C to stop servers

---

**Your servers should now be running successfully!** ✅
