import fs from 'fs';
import pdfParse from 'pdf-parse';
import logger from '../utils/logger.js';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    // Check if the extracted text is empty or too short (likely an image/scanned PDF)
    if (!data.text || data.text.trim().length < 50) {
      throw new Error('This appears to be a scanned or image-based PDF. Please upload a text-based PDF.');
    }

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    logger.error(`Error parsing PDF: ${error.message}`);
    throw error;
  } finally {
    // Clean up the uploaded file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      logger.error(`Error cleaning up file ${filePath}: ${cleanupError.message}`);
    }
  }
};
