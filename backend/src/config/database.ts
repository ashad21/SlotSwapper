import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || '';

export const connectDB = async (): Promise<void> => {
  if (!mongoUri) {
    console.error('❌ MONGO_URI or MONGODB_URI is not defined. Set it in your environment variables.');
    console.error('💡 Make sure you have a .env file with MONGO_URI=your_mongodb_connection_string');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
