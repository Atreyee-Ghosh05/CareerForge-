import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { generateToken, generateRefreshToken, generateResetToken } from '../utils/tokenUtils.js';
import { sendWelcomeEmail, sendResetPasswordEmail } from '../utils/emailService.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, PLAN_FEATURES } from '../utils/constants.js';
import crypto from 'crypto';

// Register
export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler(ERROR_MESSAGES.USER_EXISTS, 400));
  }

  // Create user
  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    username: email.split('@')[0],
  });

  // Get free plan
  const freePlan = await Plan.findOne({ name: 'free' });

  // Create subscription
  await Subscription.create({
    userId: user._id,
    planId: freePlan._id,
    planName: 'free',
    status: 'active',
  });

  // Update user limits
  user.subscription.plan = 'free';
  user.limits = PLAN_FEATURES.free;
  await user.save();

  // Send welcome email
  await sendWelcomeEmail(user);

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    refreshToken,
    user: user.toJSON(),
  });
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Find user and select password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
  }

  // Check if account is suspended
  if (user.isSuspended) {
    return next(new ErrorHandler(ERROR_MESSAGES.ACCOUNT_SUSPENDED, 403));
  }

  // Compare passwords
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    token,
    refreshToken,
    user: user.toJSON(),
  });
});

// Logout
export const logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Generate reset token
  const { resetToken, resetTokenHash } = generateResetToken();

  // Save hashed token to database
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  // Send reset email
  await sendResetPasswordEmail(user, resetToken);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.EMAIL_SENT,
  });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  // Hash the token from request
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid or expired reset token', 400));
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// Update Password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select('+password');

  // Compare current password
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('subscription');

  res.status(200).json({
    success: true,
    user: user.toJSON(),
  });
});

// Update Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, location, bio } = req.body;
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      phone,
      location,
      bio,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATED,
    user: user.toJSON(),
  });
});
