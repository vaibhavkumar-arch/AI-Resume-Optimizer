import { body, validationResult } from 'express-validator';
import { sendError } from '../utils/responseHelper.js';

// Middleware to format validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Invalid input data',
      400,
      errors.array().map((err) => err.msg)
    );
  }
  next();
};

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  validate,
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
  validate,
];

export const validateAnalysis = [
  body('resumeId').isMongoId().withMessage('Valid Resume ID is required'),
  body('jobDescription')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Job description must be at least 50 characters long'),
  validate,
];

export const validateChat = [
  body('message').trim().notEmpty().withMessage('Message cannot be empty'),
  validate,
];
