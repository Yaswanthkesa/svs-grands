import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/svs-grands';
  
  const isAtlas = uri.includes('mongodb+srv') || uri.includes('mongodb.net');
  
  try {
    await mongoose.connect(uri, {
      // Connection options for reliability
      serverSelectionTimeoutMS: isAtlas ? 10000 : 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected successfully ${isAtlas ? '(Atlas)' : '(Local)'}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('');
    if (isAtlas) {
      console.error('💡 Atlas connection tips:');
      console.error('   1. Check your connection string in .env');
      console.error('   2. Whitelist your IP at: Atlas Dashboard → Network Access');
      console.error('   3. Verify database user credentials');
    } else {
      console.error('💡 Local MongoDB tips:');
      console.error('   1. Make sure MongoDB is running locally');
      console.error('   2. Or switch to MongoDB Atlas (cloud) — see .env.example');
    }
    console.error('');
    // Don't crash the server — let it run so health check works
    // Bookings will fail gracefully with WhatsApp fallback on the frontend
    console.warn('⚠️  Server will continue running without database. Bookings will use WhatsApp fallback.');
  }
};

export default connectDB;
