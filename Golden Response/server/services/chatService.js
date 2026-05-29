import ChatHistory from '../models/ChatHistory.js';
import Analysis from '../models/Analysis.js';
import { streamChatResponse } from './aiService.js';
import { getChatbotSystemPrompt } from '../prompts/chatbotPrompt.js';
import logger from '../utils/logger.js';

export const processChat = async (userId, sessionId, message, analysisId = null) => {
  try {
    let chatSession;
    let context = {};

    // Load or create session
    if (sessionId) {
      chatSession = await ChatHistory.findOne({ _id: sessionId, userId });
      if (!chatSession) {
        throw new Error('Chat session not found');
      }
      
      // If session is linked to an analysis, load it
      if (chatSession.analysisId) {
        const analysis = await Analysis.findById(chatSession.analysisId).populate('resumeId');
        if (analysis) {
          context = {
            resumeText: analysis.resumeId?.extractedText,
            jobDescription: analysis.jobDescription,
            atsScore: analysis.atsScore,
            recommendations: analysis.recommendations,
          };
        }
      }
    } else {
      // Create new session
      chatSession = new ChatHistory({
        userId,
        analysisId: analysisId || null,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
      });
      
      // If linking to a new analysis, load it
      if (analysisId) {
        const analysis = await Analysis.findById(analysisId).populate('resumeId');
        if (analysis && analysis.userId.toString() === userId.toString()) {
           context = {
            resumeText: analysis.resumeId?.extractedText,
            jobDescription: analysis.jobDescription,
            atsScore: analysis.atsScore,
            recommendations: analysis.recommendations,
          };
        }
      }
      
      await chatSession.save();
    }

    const systemPrompt = getChatbotSystemPrompt(context);
    
    // Get stream from AI
    const stream = await streamChatResponse(chatSession.messages, message, systemPrompt);

    // Save user message
    chatSession.messages.push({ role: 'user', content: message });
    await chatSession.save();

    return { stream, chatSession };
  } catch (error) {
    logger.error(`Error in processChat service: ${error.message}`);
    throw error;
  }
};
