import express from 'express';
import {
  createInterviewProgress,
  getAllInterviewProgress,
  getInterviewProgressById,
  updateInterviewProgress,
  deleteInterviewProgress,
  getQuestionsByCategory,
  getInterviewStats,
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createInterviewProgress);
router.get('/', getAllInterviewProgress);
router.get('/stats', getInterviewStats);
router.get('/category/:category', getQuestionsByCategory);
router.get('/:id', getInterviewProgressById);
router.put('/:id', updateInterviewProgress);
router.delete('/:id', deleteInterviewProgress);

export default router;
