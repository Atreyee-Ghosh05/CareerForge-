import { body, validationResult, param } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

export const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const resetPasswordValidator = [
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  validate,
];

export const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  validate,
];

export const createResumeValidator = [
  body('title').trim().notEmpty().withMessage('Resume title is required'),
  body('template')
    .isIn(['modern', 'classic', 'minimal', 'professional', 'creative', 'premium'])
    .withMessage('Invalid template'),
  validate,
];

export const updateResumeValidator = [
  param('id').isMongoId().withMessage('Invalid resume ID'),
  validate,
];

export const createApplicationValidator = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Job role is required'),
  body('status')
    .isIn(['applied', 'assessment', 'interview', 'rejected', 'offer'])
    .withMessage('Invalid status'),
  validate,
];

export const createInternshipValidator = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Internship role is required'),
  validate,
];

export const createInterviewProgressValidator = [
  body('category')
    .isIn(['hr', 'software', 'finance', 'marketing', 'data-science'])
    .withMessage('Invalid category'),
  body('question').trim().notEmpty().withMessage('Question is required'),
  validate,
];
