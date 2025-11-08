const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing environment files...\n');

// Backend .env content with your MongoDB URI and JWT Secret
const backendEnv = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=OoGMDXC2o9pz1RTezmsGl4P1J9K2kXG9
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5174
`;

// Frontend .env content
const frontendEnv = `VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
`;

// Force create/overwrite backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
fs.writeFileSync(backendEnvPath, backendEnv);
console.log('✅ Updated backend/.env');
console.log('   MongoDB URI: mongodb://localhost:27017/slotswapper');

// Force create/overwrite frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
fs.writeFileSync(frontendEnvPath, frontendEnv);
console.log('✅ Updated frontend/.env');

console.log('\n✨ Environment files fixed!');
console.log('\n🚀 Next steps:');
console.log('   1. Stop the running servers (Ctrl+C)');
console.log('   2. Run: npm run dev');
console.log('   3. Open: http://localhost:5174');
console.log('\n');
