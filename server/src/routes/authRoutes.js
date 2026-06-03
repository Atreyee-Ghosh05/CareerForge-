import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { registerValidator, loginValidator, resetPasswordValidator, updatePasswordValidator } from '../utils/validators.js';
import { registerLimiter, loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, registerValidator, register);
router.post('/login', loginLimiter, loginValidator, login);
router.post('/forgot-password', resetPasswordValidator, forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.put('/update-password', authenticate, updatePasswordValidator, updatePassword);
router.put('/update-profile', authenticate, updateProfile);

export default router;
