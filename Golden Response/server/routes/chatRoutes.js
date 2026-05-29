import express from 'express';
import { sendMessage, getChatHistory, getChatSession, deleteChatSession } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateChat } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All chat routes are protected
router.use(protect);

router.post('/send', validateChat, sendMessage); // Limiter applied in app.js
router.get('/history', getChatHistory);
router.get('/:sessionId', getChatSession);
router.delete('/:sessionId', deleteChatSession);

export default router;
