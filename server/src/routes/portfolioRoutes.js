import express from 'express';
import {
  createPortfolio,
  getUserPortfolio,
  getPortfolioByUsername,
  updatePortfolio,
  publishPortfolio,
  unpublishPortfolio,
} from '../controllers/portfolioController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createPortfolio);
router.get('/user', authenticate, getUserPortfolio);
router.get('/public/:username', getPortfolioByUsername);
router.put('/', authenticate, updatePortfolio);
router.put('/publish', authenticate, publishPortfolio);
router.put('/unpublish', authenticate, unpublishPortfolio);

export default router;
