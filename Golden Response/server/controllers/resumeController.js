import fs from 'fs';
import Resume from '../models/Resume.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import logger from '../utils/logger.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'VALIDATION_ERROR', 'Please upload a PDF file', 400);
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Extract text from PDF
    const { text } = await extractTextFromPDF(filePath);

    // Save to DB
    const resume = await Resume.create({
      userId: req.user._id,
      originalName,
      extractedText: text,
      // For a real prod app, you might parse sections immediately,
      // but here we just store the raw text and let the AI do it later if needed.
    });

    sendSuccess(res, resume, 'Resume uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return sendError(res, 'NOT_FOUND', 'Resume not found', 404);
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to access this resume', 403);
    }

    sendSuccess(res, resume, 'Resume retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    sendSuccess(res, resumes, 'Resumes retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return sendError(res, 'NOT_FOUND', 'Resume not found', 404);
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return sendError(res, 'AUTH_ERROR', 'Not authorized to delete this resume', 403);
    }

    await Resume.deleteOne({ _id: req.params.id });
    sendSuccess(res, null, 'Resume deleted successfully');
  } catch (error) {
    next(error);
  }
};
