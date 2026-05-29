import express from 'express';
import { analyzeResume, getAnalysis, getHistory, deleteAnalysis, uploadJD, streamAnalyze } from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateAnalysis } from '../middleware/validationMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All analysis routes are protected
router.use(protect);

router.post('/analyze', validateAnalysis, analyzeResume); // Limiter applied in app.js
router.post('/stream-analyze', validateAnalysis, streamAnalyze);
// Upload JD file (PDF) and extract text
router.post('/upload-jd', upload.single('jd'), uploadJD);
router.get('/history', getHistory);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

export default router;
