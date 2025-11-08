# SlotSwapper 🔄

A modern, peer-to-peer time-slot scheduling application that allows users to swap calendar slots seamlessly.

![SlotSwapper](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

✨ **User Authentication**
- Secure JWT-based authentication
- Sign up and login with email/password
- Protected routes and API endpoints

📅 **Calendar Management**
- Create, view, update, and delete time slots
- Mark slots as BUSY, SWAPPABLE, or SWAP_PENDING
- Beautiful calendar interface

🔄 **Smart Swap Logic**
- Request swaps with other users
- Accept or reject incoming swap requests
- Atomic transactions prevent conflicts
- Automatic status updates

🔔 **Real-time Notifications**
- WebSocket-based instant notifications
- Live updates when requests are received
- No page refresh needed

🎨 **Beautiful UI/UX**
- Modern gradient backgrounds
- Responsive design for all devices
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Modern icon set
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **date-fns** - Date formatting
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **MongoDB** with Mongoose - Database
- **JWT** - Authentication tokens
- **Socket.io** - WebSocket server
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP logging
- **CORS** - Cross-origin support

## 📦 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB v5+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd SlotSwapper

# Install all dependencies
npm run install-all

# Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your configuration

cd ../frontend
cp .env.example .env
# Edit .env with your configuration

# Start the application
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For quick copy-paste commands, see [INSTALLATION_COMMANDS.md](./INSTALLATION_COMMANDS.md)

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down
```

## 📝 API Documentation

### Authentication Endpoints

**Sign Up**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Event Endpoints (Protected)

**Get All Events**
```http
GET /api/events
Authorization: Bearer <token>
```

**Create Event**
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "status": "BUSY"
}
```

**Update Event Status**
```http
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SWAPPABLE"
}
```

### Swap Endpoints (Protected)

**Get Swappable Slots**
```http
GET /api/swap/swappable-slots
Authorization: Bearer <token>
```

**Create Swap Request**
```http
POST /api/swap/swap-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mySlotId": "slot_id_1",
  "theirSlotId": "slot_id_2"
}
```

**Respond to Swap Request**
```http
POST /api/swap/swap-response/:requestId
Authorization: Bearer <token>
Content-Type: application/json

{
  "accept": true
}
```

## 🏗️ Project Structure

```
SlotSwapper/
├── backend/                    # Backend application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── database.ts    # MongoDB connection
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── eventController.ts
│   │   │   └── swapController.ts
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.ts        # JWT authentication
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Event.ts
│   │   │   └── SwapRequest.ts
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── eventRoutes.ts
│   │   │   └── swapRoutes.ts
│   │   ├── utils/             # Utility functions
│   │   │   └── jwt.ts
│   │   └── server.ts          # Express server setup
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── context/          # React context
│   │   │   └── AuthContext.tsx
│   │   ├── lib/              # Utilities
│   │   │   ├── api.ts        # Axios instance
│   │   │   ├── socket.ts     # Socket.io client
│   │   │   └── utils.ts      # Helper functions
│   │   ├── pages/            # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml         # Docker orchestration
├── package.json              # Root package.json
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
└── INSTALLATION_COMMANDS.md  # Quick installation commands
```

## 🎨 UI Components

The application uses **shadcn/ui** components for a consistent, beautiful interface:

- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Content containers with header, body, footer
- **Input** - Form inputs with validation
- **Label** - Form labels
- **Badge** - Status indicators (BUSY, SWAPPABLE, PENDING)
- **Toast** - Notifications

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Protected Routes** - Middleware-based protection
- **CORS Configuration** - Controlled cross-origin access
- **Helmet.js** - Security headers
- **Input Validation** - Server-side validation
- **MongoDB Injection Prevention** - Mongoose sanitization

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables
2. Build the application: `npm run build`
3. Start: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy the `dist/` folder

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ for the ServiceHive technical challenge

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **TailwindCSS** - Utility-first CSS framework
- **Lucide** - Icon library
- **MongoDB** - Database
- **Socket.io** - Real-time communication

---

**Happy Swapping! 🔄**
