import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import roomRoutes from './routes/rooms';
import bookingRoutes from './routes/bookings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',          // Vite dev server
  'http://localhost:4173',          // Vite preview
  process.env.CLIENT_URL,          // Production frontend URL
].filter(Boolean) as string[];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Also allow any Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SVS Grands API is running',
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB and start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 SVS Grands API running on http://localhost:${PORT}`);
  });
};

start();
