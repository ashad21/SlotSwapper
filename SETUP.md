# SlotSwapper Setup Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher) - Running locally or use MongoDB Atlas
- **npm** or **yarn**

## Quick Start

### Option 1: Manual Setup (Recommended for Development)

#### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Set Up Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If installed as service, it should already be running
# Otherwise, start it manually:
mongod
```

**Mac/Linux:**
```bash
# Using Homebrew (Mac)
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**Using MongoDB Atlas (Cloud):**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

#### 4. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### Option 2: Docker Setup

#### 1. Install Docker

Make sure Docker and Docker Compose are installed on your system.

#### 2. Run with Docker Compose

```bash
# From the root directory
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 5173

#### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## Testing the Application

### 1. Create an Account

1. Navigate to http://localhost:5173
2. Click "Sign up"
3. Fill in your details:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
4. Click "Create Account"

### 2. Create Events

1. After login, you'll see the Dashboard
2. Click "Add Event" button
3. Create a few time slots with different statuses:
   - BUSY (default)
   - SWAPPABLE (available for swap)

### 3. Test Swap Functionality

1. Mark some events as "Swappable"
2. Open another browser/incognito window
3. Create a second user account
4. Create and mark events as swappable
5. Request a swap from the marketplace
6. Accept/reject swap requests in real-time

## Project Structure

```
SlotSwapper/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── context/       # React context
│   │   ├── lib/           # Utilities & API
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml     # Docker orchestration
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event status
- `DELETE /api/events/:id` - Delete event

### Swaps
- `GET /api/swap/swappable-slots` - Get available slots
- `POST /api/swap/swap-request` - Create swap request
- `POST /api/swap/swap-response/:requestId` - Accept/reject swap
- `GET /api/swap/my-requests` - Get user's swap requests

## Features

✅ **User Authentication**
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes

✅ **Calendar Management**
- Create, view, update, and delete events
- Mark events as BUSY, SWAPPABLE, or SWAP_PENDING

✅ **Smart Swap Logic**
- Request swaps with other users
- Accept/reject swap requests
- Atomic transactions to prevent conflicts
- Automatic status updates

✅ **Real-time Notifications**
- WebSocket-based instant notifications
- Live updates when swap requests are received
- Real-time status changes

✅ **Modern UI/UX**
- Beautiful gradient backgrounds
- Responsive design
- Smooth animations
- Toast notifications
- Loading states

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check the connection string in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find and kill the process using the port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Installation Issues

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Issues

Make sure the `CLIENT_URL` in backend `.env` matches your frontend URL.

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite HMR
- Backend: ts-node-dev

### Database GUI

Use MongoDB Compass to visualize your data:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

### API Testing

Use tools like:
- **Postman** - https://www.postman.com/
- **Thunder Client** (VS Code extension)
- **curl** commands

Example:
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Production Deployment

### Environment Variables

Update these for production:
- Use a strong `JWT_SECRET`
- Use MongoDB Atlas or managed MongoDB
- Set `NODE_ENV=production`
- Update `CLIENT_URL` to your production domain

### Build Commands

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the dist/ folder with nginx or similar
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check MongoDB and Node.js logs

## License

MIT License - See LICENSE file for details
