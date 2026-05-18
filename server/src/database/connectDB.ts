import mongoose from 'mongoose';
import { getConfig } from '../config/env.js';

export async function connectDB(): Promise<void> {
  try {
    const config = getConfig();
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(config.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

export default connectDB;
