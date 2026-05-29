import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseHelper.js';

/**
 * Auth rate limiter: 5 requests per 15 minutes per IP.
 * Protects against brute-force login/register attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Too many authentication attempts. Please try again after 15 minutes.',
      429
    );
  },
});

/**
 * Analysis rate limiter: 10 requests per hour per IP.
 * Prevents abuse of the AI analysis endpoint.
 */
export const analysisLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 3600000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_ANALYSIS, 10) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Analysis rate limit reached. Please try again later.',
      429
    );
  },
});

/**
 * Chat rate limiter: 30 requests per hour per IP.
 * Prevents abuse of the chat/streaming endpoint.
 */
export const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 3600000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_CHAT, 10) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Chat rate limit reached. Please try again later.',
      429
    );
  },
});
