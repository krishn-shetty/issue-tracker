import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  } catch (err) {
    // Never print the URI (may contain credentials)
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

export const disconnectDB = () => mongoose.disconnect();
