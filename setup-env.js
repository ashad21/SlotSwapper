const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔧 Setting up environment files...\n');

// Use your specific JWT secret
const jwtSecret = 'OoGMDXC2o9pz1RTezmsGl4P1J9K2kXG9';

// Backend .env content
const backendEnv = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5174
`;

// Frontend .env content
const frontendEnv = `VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
`;

// Create backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log('✅ Created backend/.env');
} else {
  console.log('⚠️  backend/.env already exists, skipping...');
}

// Create frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log('✅ Created frontend/.env');
} else {
  console.log('⚠️  frontend/.env already exists, skipping...');
}

console.log('\n✨ Environment setup complete!');
console.log('\n📝 Your JWT Secret: ' + jwtSecret);
console.log('\n🚀 Next steps:');
console.log('   1. Make sure MongoDB is running');
console.log('   2. Run: npm run install-all');
console.log('   3. Run: npm run dev');
console.log('\n');
