import { sendError } from '../utils/responseHelper.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  // Default error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let details = null;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors).map((val) => val.message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
    code = 'DUPLICATE_KEY_ERROR';
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
    code = 'CAST_ERROR';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
    code = 'AUTH_ERROR';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
    code = 'AUTH_ERROR';
  }

  // Handle Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds limit';
    code = 'FILE_SIZE_ERROR';
  }
  
  if (err.message === 'Only PDF files are allowed!') {
    statusCode = 400;
    message = err.message;
    code = 'FILE_TYPE_ERROR';
  }

  return sendError(res, code, message, statusCode, details);
};
