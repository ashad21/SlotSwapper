# 🧪 Test API - Check Swap Requests

## Quick Test in Browser Console

Open browser console (F12) and run these commands:

### 1. Check if you're logged in
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### 2. Test the API directly
```javascript
fetch('http://localhost:5000/api/swap/my-requests', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Swap Requests:', data);
  console.log('Count:', data.count);
  console.log('Data:', data.data);
})
.catch(err => console.error('Error:', err));
```

### 3. Check all swap requests in database
```javascript
fetch('http://localhost:5000/api/swap/my-requests', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('=== SWAP REQUESTS DEBUG ===');
  console.log('Total count:', data.count);
  
  if (data.data && data.data.length > 0) {
    data.data.forEach((req, i) => {
      console.log(`\nRequest ${i + 1}:`);
      console.log('  ID:', req._id);
      console.log('  Status:', req.status);
      console.log('  Requester:', req.requester?.name || req.requester);
      console.log('  Recipient:', req.recipient?.name || req.recipient);
      console.log('  Requester Slot:', req.requesterSlot?.title);
      console.log('  Recipient Slot:', req.recipientSlot?.title);
    });
  } else {
    console.log('No swap requests found!');
  }
});
```

### 4. Check your user ID
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Your User ID:', user.id);
```

---

## Expected Output

### If requests exist:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "requester": { "name": "Alice", "email": "alice@test.com" },
      "recipient": { "name": "Bob", "email": "bob@test.com" },
      "requesterSlot": { "title": "Team Meeting", ... },
      "recipientSlot": { "title": "Focus Block", ... },
      "status": "PENDING",
      "createdAt": "..."
    }
  ]
}
```

### If no requests:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

---

## Troubleshooting

### If you get 401 Unauthorized:
- Token expired or invalid
- Log out and log in again

### If you get empty array but events show SWAP_PENDING:
- Database inconsistency
- Swap requests exist but not properly linked
- Need to check backend logs

### If you get network error:
- Backend not running
- Check: `http://localhost:5000` should respond

---

## Fix Steps

### Step 1: Verify Backend is Running
```powershell
# Check if port 5000 is listening
netstat -ano | findstr :5000
```

### Step 2: Check Backend Logs
Look in backend terminal for:
```
GET /api/swap/my-requests 200
```

### Step 3: Refresh Page
```
Ctrl + R
```

### Step 4: Clear and Re-login
```javascript
// In console
localStorage.clear();
// Then login again
```
