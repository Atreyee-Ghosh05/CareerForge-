import express from 'express';
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';
import { createApplicationValidator } from '../utils/validators.js';

const router = express.Router();

// All application routes are protected
router.use(authenticate);

// CRUD operations
router.post('/', createApplicationValidator, createApplication);
router.get('/', getAllApplications);
router.get('/stats', getApplicationStats);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
