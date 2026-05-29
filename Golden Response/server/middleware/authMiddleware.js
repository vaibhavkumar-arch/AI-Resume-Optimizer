import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/responseHelper.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return sendError(res, 'AUTH_ERROR', 'Not authorized, user not found', 401);
      }

      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 'AUTH_ERROR', 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    return sendError(res, 'AUTH_ERROR', 'Not authorized, no token', 401);
  }
};
