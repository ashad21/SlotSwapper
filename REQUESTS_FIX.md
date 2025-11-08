# 🔧 Requests Not Showing - FIXED!

## ❌ Problem

- Events showing "SWAP_PENDING" status (yellow badge)
- Requests tab showing "No incoming swap requests" and "No outgoing swap requests"
- Swap requests exist in database but not displaying

## ✅ Solution Applied

### Fixed RequestsView.tsx

**Issue:** User ID comparison was failing because:
- Backend returns `_id` field
- Frontend was only checking `id` field
- Filtering logic was too strict

**Fix:**
1. Created helper function `getUserId()` to handle both `id` and `_id`
2. Simplified filtering logic
3. Added debug logging to track issues

**Changes:**
```typescript
// Helper function to get user ID
const getUserId = (userField: any): string => {
  if (!userField) return '';
  if (typeof userField === 'string') return userField;
  return userField.id || userField._id || '';
};

// Simplified filtering
const incomingRequests = swapRequests.filter((req) => {
  const recipientId = getUserId(req.recipient);
  return req.status === 'PENDING' && recipientId === user?.id;
});

const outgoingRequests = swapRequests.filter((req) => {
  const requesterId = getUserId(req.requester);
  return requesterId === user?.id;
});
```

---

## 🚀 How to Test

### Step 1: Refresh the Page
```
Press Ctrl+R or F5
```

### Step 2: Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for debug logs:
   ```
   RequestsView - Total swap requests: X
   RequestsView - Current user ID: ...
   Incoming requests: X
   Outgoing requests: X
   ```

### Step 3: Verify Requests Appear

**For User who SENT the request (has SWAP_PENDING events):**
1. Go to "Requests" tab
2. Look at "Outgoing Requests" section
3. ✅ Should see your requests with PENDING status

**For User who RECEIVED the request:**
1. Go to "Requests" tab
2. Look at "Incoming Requests" section
3. ✅ Should see requests with Accept/Reject buttons

---

## 🔍 Debug Steps

### If requests still don't show:

#### 1. Check Console Logs
```javascript
// In browser console (F12)
// Look for these logs:
RequestsView - Total swap requests: 2
RequestsView - Current user ID: 673d...
Checking incoming: { recipientId: '673d...', userId: '673d...', isIncoming: true }
Incoming requests: 1
Outgoing requests: 1
```

#### 2. Check API Response
```javascript
// In browser console
fetch('http://localhost:5000/api/swap/my-requests', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data));
```

**Expected:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

#### 3. Verify User IDs Match
```javascript
// In console logs, check:
Checking incoming: {
  recipientId: '673d1234...',  // From request
  userId: '673d1234...',       // From current user
  isIncoming: true             // Should be true if IDs match
}
```

---

## 📊 What Each User Should See

### User A (Sent the request):

**My Calendar:**
- Events with "SWAP_PENDING" badge (yellow)

**Requests Tab → Outgoing Requests:**
```
┌─────────────────────────────────────────┐
│ Swap Request to Bob                     │
│ Sent Nov 8, 2025, 3:00 PM             │
├─────────────────────────────────────────┤
│ YOU OFFERED          │ FOR THEIR SLOT   │
│ Team Meeting         │ Focus Block      │
│ Nov 8, 3:00 PM      │ Nov 9, 2:00 PM  │
├─────────────────────────────────────────┤
│ Status: PENDING (yellow badge)          │
│ Waiting for Bob to respond...          │
└─────────────────────────────────────────┘
```

### User B (Received the request):

**Requests Tab → Incoming Requests:**
```
┌─────────────────────────────────────────┐
│ From Alice                              │
│ Nov 8, 2025, 3:00 PM                   │
├─────────────────────────────────────────┤
│ THEY OFFER          │ YOUR SLOT         │
│ Team Meeting        │ Focus Block       │
│ Nov 8, 3:00 PM     │ Nov 9, 2:00 PM   │
├─────────────────────────────────────────┤
│ [Accept]  [Reject]                      │
└─────────────────────────────────────────┘
```

---

## 🎯 Complete Test Flow

### 1. User A (Alice) - After Sending Request:
```
✅ Go to Requests tab
✅ See "Outgoing Requests (1)"
✅ See request to Bob
✅ Status shows "PENDING"
✅ Message: "Waiting for Bob to respond..."
```

### 2. User B (Bob) - Receiving Request:
```
✅ Refresh page (or wait for real-time notification)
✅ Go to Requests tab
✅ See "Incoming Requests (1)"
✅ See request from Alice
✅ See Accept and Reject buttons
✅ Slots displayed side-by-side
```

### 3. User B (Bob) - Accepting Request:
```
✅ Click "Accept" button
✅ Button shows loading spinner
✅ Toast: "Swap accepted!"
✅ Request disappears from incoming
✅ Go to "My Calendar"
✅ Calendar updates automatically
✅ Now has Alice's "Team Meeting"
✅ "Focus Block" is gone (now Alice's)
```

### 4. User A (Alice) - After Acceptance:
```
✅ Toast notification: "Swap request ACCEPTED!"
✅ Go to Requests tab
✅ Outgoing request status: "ACCEPTED" (green)
✅ Go to "My Calendar"
✅ Calendar updates automatically
✅ Now has Bob's "Focus Block"
✅ "Team Meeting" is gone (now Bob's)
```

---

## 🐛 Common Issues

### Issue 1: "No requests" but events show SWAP_PENDING

**Cause:** Frontend not fetching or filtering correctly

**Fix:**
1. Refresh page (Ctrl+R)
2. Check console for errors
3. Verify API response has data

### Issue 2: Requests show in console but not in UI

**Cause:** Filtering logic failing

**Fix:**
1. Check console logs for filter results
2. Verify user IDs match
3. Check if `isIncoming` or `isOutgoing` is true

### Issue 3: Only outgoing OR incoming shows, not both

**Expected:** This is normal!
- If you SENT request → See in Outgoing
- If you RECEIVED request → See in Incoming
- Each request appears in one section per user

---

## 📝 Verification Checklist

After fix:
- [ ] Refresh page (Ctrl+R)
- [ ] Open browser console (F12)
- [ ] Check for debug logs
- [ ] Verify "Total swap requests" > 0
- [ ] Check "Incoming requests" or "Outgoing requests" > 0
- [ ] Go to Requests tab
- [ ] See requests in appropriate section
- [ ] Incoming requests have Accept/Reject buttons
- [ ] Outgoing requests show status badge
- [ ] No console errors

---

## 🎉 Success Indicators

✅ **Everything is working if:**
- Console shows: `Incoming requests: 1` or `Outgoing requests: 1`
- Requests tab shows correct counts
- Incoming requests have Accept/Reject buttons
- Outgoing requests show PENDING/ACCEPTED/REJECTED status
- Clicking Accept/Reject works
- Calendars update after accepting
- No console errors

---

## 🚀 Next Steps

1. **Refresh your browser** (Ctrl+R)
2. **Open console** (F12) to see debug logs
3. **Go to Requests tab**
4. **Verify requests appear**
5. **Test Accept/Reject functionality**

**The fix is applied and should work immediately after page refresh!** ✅
