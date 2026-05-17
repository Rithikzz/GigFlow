import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gigflow';
    
    // Configure mongoose connection defaults
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`🚨 MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
