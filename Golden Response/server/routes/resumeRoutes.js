import express from 'express';
import { uploadResume, getResume, getAllResumes, deleteResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All resume routes are protected
router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getAllResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

export default router;
