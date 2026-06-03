import User from '../models/User.js';
import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PLAN_FEATURES } from '../utils/constants.js';
import { sendSubscriptionConfirmation } from '../utils/emailService.js';

// Get All Plans
export const getAllPlans = asyncHandler(async (req, res, next) => {
  const plans = await Plan.find({ isActive: true });

  res.status(200).json({
    success: true,
    count: plans.length,
    plans,
  });
});

// Get Plan by ID
export const getPlanById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const plan = await Plan.findById(id);

  if (!plan) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    plan,
  });
});

// Get User Subscription
export const getUserSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const subscription = await Subscription.findOne({ userId }).populate('planId');

  res.status(200).json({
    success: true,
    subscription,
  });
});

// Upgrade Subscription
export const upgradeSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { planName } = req.body;

  if (!['lite', 'pro', 'lifetime'].includes(planName)) {
    return next(new ErrorHandler('Invalid plan name', 400));
  }

  const user = await User.findById(userId);
  const plan = await Plan.findOne({ name: planName });

  if (!plan) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Update user subscription
  user.subscription.plan = planName;
  user.subscription.status = 'active';
  user.subscription.startDate = new Date();

  if (planName !== 'lifetime') {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    user.subscription.endDate = endDate;
  }

  user.limits = PLAN_FEATURES[planName];

  await user.save();

  // Update subscription record
  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      planId: plan._id,
      planName,
      status: 'active',
      startDate: new Date(),
      endDate: planName === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );

  // Send confirmation email
  await sendSubscriptionConfirmation(user, plan);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.SUBSCRIPTION_CREATED,
    subscription,
  });
});

// Cancel Subscription
export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { reason } = req.body;

  const user = await User.findById(userId);

  // Downgrade to free plan
  user.subscription.plan = 'free';
  user.subscription.status = 'cancelled';
  user.limits = PLAN_FEATURES.free;

  await user.save();

  // Update subscription record
  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      status: 'cancelled',
      cancellationReason: reason || 'User requested cancellation',
      cancelledAt: new Date(),
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Subscription cancelled successfully',
    subscription,
  });
});

// Check Feature Access
export const checkFeatureAccess = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { feature } = req.query;

  const user = await User.findById(userId);
  const features = PLAN_FEATURES[user.subscription.plan];

  const hasAccess = features[feature];

  res.status(200).json({
    success: true,
    feature,
    hasAccess: hasAccess !== false,
    planName: user.subscription.plan,
  });
});
