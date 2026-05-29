import Analysis from '../models/Analysis.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { analyzeResume as analyzeResumeService } from '../services/atsService.js';
import axios from 'axios';
import env from '../config/env.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { getATSAnalysisPrompt } from '../prompts/atsAnalysisPrompt.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return sendError(res, 'NOT_FOUND', 'Resume not found', 404);
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to use this resume', 403);
    }

    // Call AI Service to get analysis
    const analysisResult = await analyzeResumeService(resume.extractedText, jobDescription);

    // Save Analysis to DB
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobDescription,
      ...analysisResult, // Spread the results from the AI
    });

    // Increment user analysis count
    await User.findByIdAndUpdate(req.user._id, { $inc: { analysisCount: 1 } });

    sendSuccess(res, analysis, 'Analysis completed successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Upload a JD file (PDF) and return the extracted text
export const uploadJD = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'VALIDATION_ERROR', 'Please upload a PDF job description', 400);
    }

    const filePath = req.file.path;
    const { text } = await extractTextFromPDF(filePath);

    return sendSuccess(res, { jobDescription: text }, 'Job description extracted successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate('resumeId');

    if (!analysis) {
      return sendError(res, 'NOT_FOUND', 'Analysis not found', 404);
    }

    if (analysis.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to access this analysis', 403);
    }

    sendSuccess(res, analysis, 'Analysis retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ userId: req.user._id })
      .populate('resumeId', 'originalName')
      .sort({ analyzedAt: -1 });
    sendSuccess(res, history, 'Analysis history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return sendError(res, 'NOT_FOUND', 'Analysis not found', 404);
    }

    if (analysis.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to delete this analysis', 403);
    }

    await Analysis.deleteOne({ _id: req.params.id });
    sendSuccess(res, null, 'Analysis deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Stream analysis using OpenAI/Groq streaming API (proxy to client). Sends token-level text
// and, on completion, saves the final analysis and sends a final control message.
export const streamAnalyze = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return sendError(res, 'NOT_FOUND', 'Resume not found', 404);
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to use this resume', 403);
    }

    if (!process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
      return sendError(res, 'NOT_CONFIGURED', 'OpenAI/Groq streaming not configured on server', 400);
    }

    const isGroq = !!process.env.GROQ_API_KEY;
    const apiKey = isGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const apiUrl = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    const modelName = isGroq 
      ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
      : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

    // Prepare streaming request headers
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // Send SSE/stream headers to client
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Use full prompt generated with resume text and job description
    const promptText = getATSAnalysisPrompt(resume.extractedText, jobDescription);

    const body = {
      model: modelName,
      messages: [ { role: 'user', content: promptText } ],
      stream: true,
      temperature: 0.0,
    };
    if (isGroq) {
      body.response_format = { type: 'json_object' };
    }

    const streamResponse = await axios.post(apiUrl, body, { headers, responseType: 'stream', timeout: 0 });

    const stream = streamResponse.data;
    let buffer = '';

    stream.on('data', async (chunk) => {
      const text = chunk.toString('utf8');
      // Forward raw token text to client
      res.write(text);
      buffer += text;
    });

    stream.on('end', async () => {
      try {
        const lines = buffer.split('\n');
        let assembled = '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const j = JSON.parse(trimmed.slice(6));
              const delta = j.choices?.[0]?.delta?.content;
              if (delta) assembled += delta;
            } catch (e) {
              // skip parse errors
            }
          }
        }

        // Try parse assembled as JSON
        let analysisObj = null;
        try {
          analysisObj = JSON.parse(assembled);
        } catch (e) {
          console.error('Failed to parse streamed JSON. Falling back to non-streaming analyzer...', e);
          analysisObj = await analyzeResumeService(resume.extractedText, jobDescription);
        }

        // Save analysis
        const analysis = await Analysis.create({
          userId: req.user._id,
          resumeId: resume._id,
          jobDescription,
          ...analysisObj,
        });

        await User.findByIdAndUpdate(req.user._id, { $inc: { analysisCount: 1 } });

        // Send final control message with analysis id
        res.write('\n<<ANALYSIS_COMPLETE>>' + JSON.stringify({ analysisId: analysis._id }));
        res.end();
      } catch (err) {
        console.error('Stream finalize error', err);
        res.write('\n<<ANALYSIS_ERROR>>');
        res.end();
      }
    });

    stream.on('error', (err) => {
      console.error('API stream error', err);
      res.write('\n<<ANALYSIS_ERROR>>');
      res.end();
    });
  } catch (error) {
    next(error);
  }
};
