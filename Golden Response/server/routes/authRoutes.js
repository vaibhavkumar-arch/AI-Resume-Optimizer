import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
// We should import the rate limiter here but for simplicity we can apply it in app.js or here
// import { authLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register); // apply authLimiter in app.js
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;
