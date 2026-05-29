import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import axios from 'axios';
import logger from '../utils/logger.js';
import env from '../config/env.js';

let genAI = null;
let model = null;

export const initializeAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is missing');
      return;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
    logger.info('Google Gemini AI initialized');
  }
  return { genAI, model };
};

export const generateAnalysis = async (promptText) => {
  // Prefer OpenAI if key provided (user requested OpenAI)
  if (process.env.OPENAI_API_KEY) {
    try {
      logger.info('Calling OpenAI for analysis as fallback/provider...');
      const openaiRes = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.OPENAI_MODEL || env.openaiModel,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 1500,
          temperature: 0.0,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        }
      );

      const text = openaiRes.data?.choices?.[0]?.message?.content || '';
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        logger.error('Failed to parse OpenAI JSON response', { parseErr: parseErr.message });
        logger.error('Raw OpenAI response (truncated):', text.slice(0, 4000));
        // fallthrough to Gemini path if OpenAI returned unparsable
      }
    } catch (openErr) {
      logger.error('OpenAI call failed:', openErr.message || openErr);
      // If OpenAI fails, we'll continue to try Gemini below
    }
  }

  if (!model) initializeAI();

  try {
    const generationConfig = {
      responseMimeType: 'application/json',
      // We could add a responseSchema here for stricter enforcement, 
      // but the prompt is already very specific and responseMimeType: 'application/json' 
      // usually suffices for Gemini 1.5/2.0
    };

    logger.info('Calling Gemini API for analysis...');
    
    // Add a simple timeout wrap if needed, though sdk might handle it.
    const maxRetries = 3;
    const baseDelayMs = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          generationConfig,
        });

        const response = result.response;
        const text = await response.text();

        try {
          return JSON.parse(text);
        } catch (parseErr) {
          logger.error('Failed to parse Gemini JSON response', { parseErr: parseErr.message });
          logger.error('Raw Gemini response (truncated):', text.slice(0, 4000));
          throw new Error('AI returned an unparsable response');
        }
      } catch (err) {
        const msg = err?.message || String(err);
        // Retry for rate limits or transient network errors
        const isRateLimit = msg.includes('429') || /Too Many Requests/i.test(msg);
        const isTransient = /timeout|ETIMEDOUT|ECONNRESET|ENOTFOUND|NetworkError/i.test(msg);

        logger.error(`Gemini API attempt ${attempt} failed: ${msg}`);

        if ((isRateLimit || isTransient) && attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          logger.info(`Retrying Gemini API in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // No retry left or non-transient error
        throw err;
      }
    }
    // If we somehow exit loop without returning, throw generic
    throw new Error('AI analysis failed after retries');
  } catch (error) {
    logger.error(`Gemini API Error in generateAnalysis: ${error.message}`);
    throw new Error('AI analysis failed. Please try again later.');
  }
};

export const streamChatResponse = async (history, message, systemPrompt) => {
  if (!model) initializeAI();

  try {
    const chatModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });

    // Format history for Gemini API
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = chatModel.startChat({
      history: formattedHistory,
    });

    logger.info('Calling Gemini API for chat stream...');
    const result = await chat.sendMessageStream(message);
    
    return result.stream;
  } catch (error) {
    logger.error(`Gemini API Error in streamChatResponse: ${error.message}`);
    throw new Error('AI chat failed. Please try again later.');
  }
};
