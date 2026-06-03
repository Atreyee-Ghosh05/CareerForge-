import express from 'express';
import {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getInternshipStats,
} from '../controllers/internshipController.js';
import { authenticate } from '../middleware/auth.js';
import { createInternshipValidator } from '../utils/validators.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createInternshipValidator, createInternship);
router.get('/', getAllInternships);
router.get('/stats', getInternshipStats);
router.get('/:id', getInternshipById);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);

export default router;
