import ChatHistory from '../models/ChatHistory.js';
import { processChat } from '../services/chatService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import logger from '../utils/logger.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { sessionId, message, analysisId } = req.body;

    const { stream, chatSession } = await processChat(req.user._id, sessionId, message, analysisId);

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial session ID if new
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: chatSession._id })}\n\n`);

    let fullAiResponse = '';

    // Iterate through the stream chunks
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      fullAiResponse += chunkText;
      // Send chunk to client
      res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
    }

    // Save AI response to history
    chatSession.messages.push({ role: 'assistant', content: fullAiResponse });
    await chatSession.save();

    // Signal end of stream
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    logger.error(`Error in sendMessage controller: ${error.message}`);
    // If headers already sent, we can't send a normal JSON error response
    if (!res.headersSent) {
        next(error);
    } else {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to generate response' })}\n\n`);
        res.end();
    }
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user._id })
      .select('-messages') // Don't send full messages array for list view
      .sort({ updatedAt: -1 });
    sendSuccess(res, sessions, 'Chat history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getChatSession = async (req, res, next) => {
  try {
    const session = await ChatHistory.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });

    if (!session) {
      return sendError(res, 'NOT_FOUND', 'Chat session not found', 404);
    }

    sendSuccess(res, session, 'Chat session retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteChatSession = async (req, res, next) => {
  try {
    const session = await ChatHistory.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });

    if (!session) {
      return sendError(res, 'NOT_FOUND', 'Chat session not found', 404);
    }

    await ChatHistory.deleteOne({ _id: req.params.sessionId });
    sendSuccess(res, null, 'Chat session deleted successfully');
  } catch (error) {
    next(error);
  }
};
