import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route imports
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Middleware imports
import { errorHandler } from './middleware/errorMiddleware.js';
import { authLimiter, analysisLimiter, chatLimiter } from './config/rateLimiter.js';

const app = express();

// Security Middleware
app.use(helmet());
// Allow the client origin and also accept 5174 during development
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes); // Apply rate limiter to all auth routes
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisLimiter, analysisRoutes); // Apply rate limiter to analysis
app.use('/api/chat', chatLimiter, chatRoutes); // Apply rate limiter to chat

// Root route
app.get('/', (req, res) => {
  res.send('AI Resume Optimizer API is running...');
});

// Global Error Handler
app.use(errorHandler);

export default app;
