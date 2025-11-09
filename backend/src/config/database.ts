import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
  if (!mongoUri) {
    console.error("❌  No MONGO_URI defined in environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
