import mongoose from 'mongoose';
import { getConfig } from '../config/env.js';

export async function connectDB(): Promise<void> {
  const config = getConfig();
  mongoose.set('strictQuery', true);

  const primaryUri = config.MONGO_URI;
  
  // List of fallback connection strings in case MongoDB Atlas whitelisting blocks connection
  const fallbacks = [
    'mongodb://mongodb:27017/gigflow', // Docker internal link name
    'mongodb://127.0.0.1:27017/gigflow', // Standard local IPv4 loopback
    'mongodb://localhost:27017/gigflow' // Standard localhost name
  ];

  try {
    console.log('Attempting connection to primary MongoDB database...');
    // Reduce server selection timeout to 4000ms so we failover quickly instead of hanging
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB connected successfully to primary: ${conn.connection.host}`);
    return;
  } catch (primaryErr: unknown) {
    const err = primaryErr as Error;
    console.warn(`⚠️ Primary MongoDB connection failed (likely Atlas IP whitelist block): ${err.message}`);
    
    // Try fallback options sequentially
    for (const fallbackUri of fallbacks) {
      if (fallbackUri === primaryUri) continue;
      try {
        console.log(`Attempting fallback database connection to: ${fallbackUri}...`);
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 2000
        });
        console.log(`🎉 MongoDB successfully connected to local fallback: ${conn.connection.host}`);
        return;
      } catch (fallbackErr: unknown) {
        const ferr = fallbackErr as Error;
        console.warn(`Fallback connection to ${fallbackUri} failed: ${ferr.message}`);
      }
    }

    console.error('❌ Critical: Both primary database and local fallback databases failed.');
    process.exit(1);
  }
}

export default connectDB;
