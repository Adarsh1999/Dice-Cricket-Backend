import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { validateEnvironment } from './utils/validation.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { DEFAULT_PORT, LIMITS } from './constants/index.js';
import gameRoutes from './routes/gameRoutes.js';

// Load environment variables
dotenv.config();

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  console.error('💡 Please ensure you have a .env file with MONGODB_URL configured');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// Connect to database
connectDB(process.env.MONGODB_URL);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: LIMITS.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: LIMITS.JSON_LIMIT }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dice Cricket Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Favicon handler to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response
});

// API routes
app.use('/api', gameRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: See API.md file`);
});
