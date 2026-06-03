import express from 'express';
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  downloadResume,
  setPrimaryResume,
} from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';
import { createResumeValidator, updateResumeValidator } from '../utils/validators.js';

const router = express.Router();

// All resume routes are protected
router.use(authenticate);

// CRUD operations
router.post('/', createResumeValidator, createResume);
router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResumeValidator, updateResume);
router.delete('/:id', deleteResume);

// Additional operations
router.get('/:id/download', downloadResume);
router.put('/:id/set-primary', setPrimaryResume);

export default router;
