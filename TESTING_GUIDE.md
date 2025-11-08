# 🧪 SlotSwapper - Complete Testing Guide

## 🎯 Core Concept

**SlotSwapper** is a peer-to-peer time-slot scheduling application where users can swap their busy time slots with each other.

### Example Scenario:
- **User A** has "Team Meeting" on Tuesday 10:00-11:00 AM → Marks as SWAPPABLE
- **User B** has "Focus Block" on Wednesday 2:00-3:00 PM → Marks as SWAPPABLE
- **User A** sees User B's slot in Marketplace → Requests swap
- **User B** receives notification → Can Accept or Reject
- **If Accepted**: Calendars update automatically - User A gets Wednesday slot, User B gets Tuesday slot

---

## 🚀 Step-by-Step Testing

### Prerequisites
1. **Two browsers** (or normal + incognito mode)
2. **Servers running**: `npm run dev`
3. **MongoDB running**: Check with `Get-Service MongoDB`

---

### Test 1: Create Two Users

#### Browser 1 (User A):
1. Go to `http://localhost:5174`
2. Click "Sign up"
3. Fill in:
   - Name: `Alice`
   - Email: `alice@test.com`
   - Password: `password123`
4. Click "Sign up"
5. ✅ Should redirect to dashboard

#### Browser 2 (User B) - Incognito:
1. Go to `http://localhost:5174`
2. Click "Sign up"
3. Fill in:
   - Name: `Bob`
   - Email: `bob@test.com`
   - Password: `password123`
4. Click "Sign up"
5. ✅ Should redirect to dashboard

---

### Test 2: Create Events

#### User A (Alice):
1. Click "+ Add Event" button
2. Fill form:
   - Title: `Team Meeting`
   - Start Time: `Tomorrow at 10:00 AM`
   - End Time: `Tomorrow at 11:00 AM` (optional)
   - Description: `Weekly team sync`
   - Status: `BUSY`
3. Click "Create Event"
4. ✅ Event appears in calendar

#### User B (Bob):
1. Click "+ Add Event" button
2. Fill form:
   - Title: `Focus Block`
   - Start Time: `Day after tomorrow at 2:00 PM`
   - End Time: `Day after tomorrow at 3:00 PM`
   - Description: `Deep work session`
   - Status: `BUSY`
3. Click "Create Event"
4. ✅ Event appears in calendar

---

### Test 3: Mark Events as Swappable

#### User A (Alice):
1. Find "Team Meeting" event
2. Click "Mark as Swappable" button
3. ✅ Status changes to "SWAPPABLE" (green badge)

#### User B (Bob):
1. Find "Focus Block" event
2. Click "Mark as Swappable" button
3. ✅ Status changes to "SWAPPABLE" (green badge)

---

### Test 4: Request a Swap

#### User A (Alice):
1. Click "Marketplace" tab
2. ✅ Should see Bob's "Focus Block" slot
3. Click "Request Swap" button on Bob's slot
4. **Modal opens** showing:
   - Bob's slot details (blue card)
   - Your swappable slots (radio buttons)
5. Select "Team Meeting" (radio button)
6. Click "Send Swap Request"
7. ✅ Modal closes
8. ✅ Toast notification: "Swap request sent successfully!"
9. ✅ Marketplace refreshes

---

### Test 5: View Outgoing Request

#### User A (Alice):
1. Click "Requests" tab
2. Look at "Outgoing Requests" section
3. ✅ Should see:
   - Request to Bob
   - Your offered slot: "Team Meeting" (purple card)
   - Their slot: "Focus Block" (blue card)
   - Status: **"PENDING"** (yellow badge)
   - Message: "Waiting for Bob to respond..."

---

### Test 6: Receive and View Incoming Request

#### User B (Bob):
1. ✅ Should see toast notification: "New swap request received!"
2. Click "Requests" tab
3. Look at "Incoming Requests" section
4. ✅ Should see:
   - Request from Alice
   - Their offered slot: "Team Meeting" (blue card)
   - Your slot: "Focus Block" (purple card)
   - Two buttons: "Accept" and "Reject"

---

### Test 7: Accept the Swap

#### User B (Bob):
1. In "Incoming Requests", find Alice's request
2. Click "Accept Swap" button
3. ✅ Button shows loading spinner
4. ✅ Toast notification: "Swap accepted!"
5. ✅ Request disappears from incoming list
6. Click "My Calendar" tab
7. ✅ **Calendar updates automatically!**
8. ✅ "Focus Block" is now owned by Alice
9. ✅ "Team Meeting" is now owned by Bob

#### User A (Alice):
1. ✅ Toast notification: "Swap request ACCEPTED!"
2. Click "Requests" tab
3. ✅ Outgoing request status: "ACCEPTED" (green badge)
4. Click "My Calendar" tab
5. ✅ **Calendar updates automatically!**
6. ✅ "Team Meeting" is gone (now Bob's)
7. ✅ "Focus Block" now appears (now yours)

---

### Test 8: Reject a Swap (Alternative)

#### Create Another Swap Request:
1. User A creates new swappable event
2. User B creates new swappable event
3. User A requests swap

#### User B (Bob):
1. Go to "Requests" tab
2. Find incoming request
3. Click "Reject" button
4. ✅ Toast notification: "Swap rejected!"
5. ✅ Request disappears
6. ✅ Both events stay with original owners

#### User A (Alice):
1. ✅ Toast notification: "Swap request REJECTED!"
2. Go to "Requests" tab
3. ✅ Outgoing request status: "REJECTED" (gray badge)
4. ✅ Events unchanged

---

## 🔍 What to Verify

### ✅ Marketplace Tab
- [ ] Shows swappable slots from OTHER users only
- [ ] Does NOT show your own slots
- [ ] Search bar filters slots
- [ ] "Request Swap" button opens modal
- [ ] Modal shows target slot details
- [ ] Modal lists YOUR swappable slots with radio buttons
- [ ] Can't send request without selecting your slot
- [ ] Success toast after sending request
- [ ] Marketplace refreshes after request

### ✅ Requests Tab - Incoming
- [ ] Shows swaps where YOU are the recipient
- [ ] Displays requester's name
- [ ] Shows both slots side-by-side (blue vs purple)
- [ ] "Accept" button works
- [ ] "Reject" button works
- [ ] Loading state on buttons
- [ ] Request disappears after response
- [ ] Toast notification confirms action

### ✅ Requests Tab - Outgoing
- [ ] Shows swaps where YOU are the requester
- [ ] Displays recipient's name
- [ ] Shows both slots side-by-side (purple vs blue)
- [ ] Status badge shows PENDING/ACCEPTED/REJECTED
- [ ] "Waiting for response..." message for pending
- [ ] Status updates when other user responds
- [ ] No action buttons (can't cancel)

### ✅ Dynamic Updates
- [ ] Calendar updates immediately after swap accepted
- [ ] No manual page refresh needed
- [ ] Real-time toast notifications
- [ ] Socket.io events working
- [ ] Event ownership changes correctly
- [ ] Marketplace updates after swap

### ✅ Calendar Updates
- [ ] After accepting swap:
  - [ ] Your slot disappears (now theirs)
  - [ ] Their slot appears (now yours)
  - [ ] Event times stay the same
  - [ ] Event titles stay the same
  - [ ] Only ownership changes

---

## 🐛 Troubleshooting

### Issue: No requests showing in Requests tab

**Check:**
1. Backend is running (port 5000)
2. Open browser console (F12)
3. Look for API errors
4. Check Network tab for `/api/swap/my-requests` call
5. Verify response has data

**Fix:**
```powershell
# Check backend terminal for errors
# Should see: "MongoDB Connected"
# Should NOT see: "EADDRINUSE" error
```

### Issue: Marketplace shows "No slots available"

**Possible causes:**
1. Other user hasn't marked events as SWAPPABLE
2. Backend not fetching correctly
3. You're looking at your own slots (filtered out)

**Fix:**
1. Ensure other user has SWAPPABLE events
2. Click "Refresh" button in marketplace
3. Check browser console for errors

### Issue: Swap request not appearing for other user

**Check:**
1. Socket.io connection
2. Backend terminal should show: "User [ID] joined their room"
3. Check if request was created in database

**Fix:**
```powershell
# Restart servers
Ctrl+C
npm run dev
```

### Issue: Calendar not updating after swap

**Check:**
1. Swap was actually accepted (check status)
2. Refresh page manually (should work without this)
3. Check browser console for errors

**Fix:**
1. Click "My Calendar" tab again
2. Or refresh page (Ctrl+R)

---

## 📊 Expected API Calls

### When requesting a swap:
```
POST /api/swap/swap-request
Body: { mySlotId: "...", theirSlotId: "..." }
Response: { message: "Swap request created successfully", data: {...} }
```

### When viewing requests:
```
GET /api/swap/my-requests
Response: { success: true, count: X, data: [...] }
```

### When accepting/rejecting:
```
POST /api/swap/swap-response/:requestId
Body: { accept: true/false }
Response: { success: true, data: {...} }
```

---

## 🎯 Success Criteria

### ✅ All Features Working:
- [ ] Two users can create accounts
- [ ] Users can create events
- [ ] Users can mark events as SWAPPABLE
- [ ] Marketplace shows other users' swappable slots
- [ ] Request Swap opens modal with slot selection
- [ ] Incoming requests show with Accept/Reject buttons
- [ ] Outgoing requests show with PENDING status
- [ ] Accepting swap updates both calendars automatically
- [ ] Rejecting swap keeps events unchanged
- [ ] Real-time notifications work
- [ ] No manual refresh needed

---

## 🎉 Complete Test Flow

```
1. Create User A (Alice) ✅
2. Create User B (Bob) ✅
3. Alice creates "Team Meeting" event ✅
4. Bob creates "Focus Block" event ✅
5. Alice marks event as SWAPPABLE ✅
6. Bob marks event as SWAPPABLE ✅
7. Alice goes to Marketplace ✅
8. Alice sees Bob's slot ✅
9. Alice clicks "Request Swap" ✅
10. Modal opens with slot selection ✅
11. Alice selects her slot ✅
12. Alice sends request ✅
13. Bob receives notification ✅
14. Bob goes to Requests tab ✅
15. Bob sees incoming request ✅
16. Bob clicks "Accept" ✅
17. Both calendars update automatically ✅
18. Alice now has Bob's slot ✅
19. Bob now has Alice's slot ✅
20. SUCCESS! 🎉
```

---

## 📝 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] MongoDB service running
- [ ] Two browsers/windows open
- [ ] Two different users created
- [ ] Both users have swappable events
- [ ] Marketplace shows other user's slots
- [ ] Request swap modal works
- [ ] Incoming requests visible
- [ ] Outgoing requests visible
- [ ] Accept button works
- [ ] Reject button works
- [ ] Calendars update automatically
- [ ] Toast notifications appear
- [ ] No console errors

---

**If all checkboxes are ✅, your SlotSwapper is working perfectly!** 🎉
