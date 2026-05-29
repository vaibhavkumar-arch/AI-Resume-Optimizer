import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import env from './env.js';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Connect to MongoDB with retry logic (exponential backoff).
 */
async function connectDB() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      logger.info(`Attempting MongoDB connection (attempt ${retries + 1}/${MAX_RETRIES})...`);

      const conn = await mongoose.connect(env.mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      logger.info(`MongoDB connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        logger.error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${error.message}`);
        throw error;
      }

      const delay = BASE_DELAY_MS * Math.pow(2, retries - 1);
      logger.warn(`MongoDB connection attempt ${retries} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Connection event listeners
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connection established.');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose connection disconnected.');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('Mongoose connection closed through app termination (SIGINT).');
    process.exit(0);
  });
}

export default connectDB;
