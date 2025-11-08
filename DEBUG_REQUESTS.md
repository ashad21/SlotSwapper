# 🔍 Debug: Requests Not Showing

## Issue
Requests tab shows "No incoming swap requests" and "No outgoing swap requests" even after sending swap requests.

---

## ✅ Quick Fixes

### Fix 1: Check Backend is Running
```powershell
# Backend should show:
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

**If not running:**
```powershell
# Kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Fix 2: Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for errors (red text)
4. Check **Network** tab
5. Look for `/api/swap/my-requests` call
6. Click on it → Check **Response**

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "requester": { "name": "Alice", ... },
      "recipient": { "name": "Bob", ... },
      "requesterSlot": { "title": "Team Meeting", ... },
      "recipientSlot": { "title": "Focus Block", ... },
      "status": "PENDING"
    }
  ]
}
```

### Fix 3: Verify Swap Request Was Created
1. Check backend terminal
2. Should see: `POST /api/swap/swap-request 201`
3. If you see `400` or `500`, there's an error

### Fix 4: Refresh the Page
1. Press **Ctrl+R** or **F5**
2. Go to Requests tab again
3. Requests should appear

---

## 🧪 Step-by-Step Debug

### Step 1: Verify Events Are Swappable
1. Go to "My Calendar" tab
2. Check your events
3. ✅ At least one should have **green "SWAPPABLE" badge**
4. ❌ If all are "BUSY", mark one as swappable first

### Step 2: Verify Request Was Sent
**After clicking "Send Swap Request":**
1. ✅ Modal should close
2. ✅ Toast notification: "Swap request sent successfully!"
3. ✅ Check browser console (F12) - no errors

**If modal doesn't close:**
- Check console for errors
- Verify you selected a slot (radio button)

### Step 3: Check API Response
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Requests" tab in app
4. Look for `my-requests` call
5. Click on it
6. Check **Response** tab

**If response is empty:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```
**Means:** No requests in database

**If you see error:**
```json
{
  "success": false,
  "message": "..."
}
```
**Action:** Check backend terminal for detailed error

### Step 4: Check Database
**Backend terminal should show:**
```
POST /api/swap/swap-request 201 - 45ms
Socket.io: Emitting swap-request to user [ID]
```

**If you see:**
```
POST /api/swap/swap-request 400 - 10ms
```
**Means:** Validation error (check error message)

---

## 🔧 Common Issues & Solutions

### Issue 1: "No swappable slots" in modal
**Cause:** You don't have any SWAPPABLE events

**Fix:**
1. Go to "My Calendar" tab
2. Find an event
3. Click "Mark as Swappable"
4. Try requesting swap again

### Issue 2: Modal doesn't open
**Cause:** JavaScript error or component not loaded

**Fix:**
1. Check browser console (F12)
2. Look for red errors
3. Refresh page (Ctrl+R)
4. Try again

### Issue 3: Request sent but not appearing
**Possible causes:**
- Backend didn't save to database
- MongoDB not connected
- Socket.io not working

**Debug:**
```powershell
# Check MongoDB
Get-Service MongoDB
# Should show: Status = Running

# Check backend terminal
# Should see: "MongoDB Connected"
```

### Issue 4: Incoming requests not showing for other user
**Cause:** Socket.io notification not received or page not refreshed

**Fix:**
1. **Other user**: Refresh page (Ctrl+R)
2. **Other user**: Click "Requests" tab
3. Should see incoming request

**If still not showing:**
- Check backend terminal for socket events
- Verify both users are logged in
- Check browser console for errors

### Issue 5: Outgoing requests show but incoming don't
**Cause:** Filtering logic issue

**Debug:**
1. Check user IDs match
2. Verify `recipient` field in request
3. Check backend logs

---

## 🎯 Manual Test

### Test if API is working:

**1. Get your user ID:**
```javascript
// In browser console (F12)
localStorage.getItem('user')
// Copy the "id" field
```

**2. Check requests directly:**
```javascript
// In browser console
fetch('http://localhost:5000/api/swap/my-requests', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log(data))
```

**Expected output:**
```json
{
  "success": true,
  "count": X,
  "data": [...]
}
```

---

## 📊 Verification Checklist

### Before requesting swap:
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5174)
- [ ] MongoDB service running
- [ ] Two users created and logged in
- [ ] Both users have events
- [ ] Both users marked events as SWAPPABLE
- [ ] Can see other user's slot in Marketplace

### After requesting swap:
- [ ] Modal closed
- [ ] Toast notification appeared
- [ ] No console errors
- [ ] Backend shows: `POST /api/swap/swap-request 201`
- [ ] Requester sees outgoing request
- [ ] Recipient sees incoming request (after refresh)

### If requests not showing:
- [ ] Refresh page (Ctrl+R)
- [ ] Check browser console for errors
- [ ] Check Network tab for API calls
- [ ] Verify API response has data
- [ ] Check backend terminal for errors
- [ ] Verify MongoDB is connected

---

## 🚀 Quick Reset

If nothing works, reset everything:

```powershell
# 1. Stop servers
Ctrl+C

# 2. Kill all ports
netstat -ano | findstr :5000
taskkill /PID <PID> /F
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# 3. Restart MongoDB
Restart-Service MongoDB

# 4. Clear browser data
# In browser: Ctrl+Shift+Delete
# Clear: Cookies, Cache, Local Storage

# 5. Restart servers
npm run dev

# 6. Create new users and test again
```

---

## 📝 Expected Behavior

### Correct Flow:

1. **User A** requests swap
   - Modal opens
   - Selects slot
   - Clicks "Send"
   - Modal closes
   - Toast: "Swap request sent successfully!"

2. **User A** goes to Requests tab
   - **Outgoing Requests** section shows:
     - Request to User B
     - Status: PENDING
     - Your slot (purple)
     - Their slot (blue)

3. **User B** (other browser)
   - Toast notification: "New swap request received!"
   - Goes to Requests tab
   - **Incoming Requests** section shows:
     - Request from User A
     - Accept/Reject buttons
     - Their slot (blue)
     - Your slot (purple)

4. **User B** clicks Accept
   - Button shows loading
   - Toast: "Swap accepted!"
   - Request disappears
   - Calendar updates

5. **User A** (first browser)
   - Toast: "Swap request ACCEPTED!"
   - Outgoing request status: ACCEPTED
   - Calendar updates

---

## 🎉 Success Indicators

✅ **Everything is working if:**
- Requests tab shows correct counts: `Incoming Requests (1)`, `Outgoing Requests (1)`
- Incoming requests have Accept/Reject buttons
- Outgoing requests show PENDING status
- Clicking Accept/Reject works
- Calendars update after accepting
- Toast notifications appear
- No console errors

---

**If you're still having issues after trying all fixes, check the backend terminal for detailed error messages and share them for further debugging.**
