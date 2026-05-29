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
  // 1. Prefer Groq if key provided (user key)
  if (process.env.GROQ_API_KEY) {
    try {
      logger.info('Calling Groq for analysis...');
      const groqRes = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: promptText }],
          temperature: 0.0,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 120000,
        }
      );

      const text = groqRes.data?.choices?.[0]?.message?.content || '';
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        logger.error('Failed to parse Groq JSON response', { parseErr: parseErr.message });
        logger.error('Raw Groq response (truncated):', text.slice(0, 4000));
        // Fall through to OpenAI/Gemini if parsing fails
      }
    } catch (groqErr) {
      logger.error('Groq call failed:', groqErr.response?.data || groqErr.message || groqErr);
      // Fall through to OpenAI/Gemini if API call fails
    }
  }

  // 2. Fall back to OpenAI if key provided
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
        // Fallthrough to Gemini path if OpenAI returned unparsable
      }
    } catch (openErr) {
      logger.error('OpenAI call failed:', openErr.message || openErr);
      // If OpenAI fails, we'll continue to try Gemini below
    }
  }

  // 3. Fall back to Gemini
  if (!model) initializeAI();

  try {
    const generationConfig = {
      responseMimeType: 'application/json',
    };

    logger.info('Calling Gemini API for analysis...');
    
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
        const isRateLimit = msg.includes('429') || /Too Many Requests/i.test(msg);
        const isTransient = /timeout|ETIMEDOUT|ECONNRESET|ENOTFOUND|NetworkError/i.test(msg);

        logger.error(`Gemini API attempt ${attempt} failed: ${msg}`);

        if ((isRateLimit || isTransient) && attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          logger.info(`Retrying Gemini API in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw err;
      }
    }
    throw new Error('AI analysis failed after retries');
  } catch (error) {
    logger.error(`Gemini API Error in generateAnalysis: ${error.message}`);
    throw new Error('AI analysis failed. Please try again later.');
  }
};

export const streamChatResponse = async (history, message, systemPrompt) => {
  // Support Groq or OpenAI streaming chat response
  if (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY) {
    const isGroq = !!process.env.GROQ_API_KEY;
    const apiKey = isGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const apiUrl = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    const modelName = isGroq 
      ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
      : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

    logger.info(`Calling ${isGroq ? 'Groq' : 'OpenAI'} API for chat stream...`);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: modelName,
          messages,
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        }
      );

      // Async generator yielding objects containing a text() method to conform with Gemini's API
      async function* makeGenerator() {
        const stream = response.data;
        let buffer = '';
        
        for await (const chunk of stream) {
          buffer += chunk.toString('utf8');
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Save the incomplete last line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed === 'data: [DONE]') continue;
            if (trimmed.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const text = parsed.choices?.[0]?.delta?.content || '';
                if (text) {
                  yield { text: () => text };
                }
              } catch (err) {
                // skip line parse errors
              }
            }
          }
        }

        if (buffer && buffer.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(buffer.slice(6));
            const text = parsed.choices?.[0]?.delta?.content || '';
            if (text) {
              yield { text: () => text };
            }
          } catch (err) {
            // ignore
          }
        }
      }

      return makeGenerator();
    } catch (err) {
      logger.error(`${isGroq ? 'Groq' : 'OpenAI'} streaming chat call failed: ${err.message}`);
      // Fall through to Gemini path if error occurs
    }
  }

  // Fall back to Gemini SDK
  if (!model) initializeAI();

  try {
    const chatModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    });

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
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
