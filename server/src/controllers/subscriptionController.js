import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PLAN_FEATURES } from '../utils/constants.js';
import { sendSubscriptionConfirmation } from '../utils/emailService.js';

export const getAllPlans = asyncHandler(async (req, res, next) => {
  const plans = await Plan.find({ isActive: true });
  res.status(200).json({ success: true, count: plans.length, plans });
});

export const getPlanById = asyncHandler(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  res.status(200).json({ success: true, plan });
});

export const getUserSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findOne({ userId: req.user._id }).populate('planId');
  res.status(200).json({ success: true, subscription });
});

export const upgradeSubscription = asyncHandler(async (req, res, next) => {
  const { planName } = req.body;
  if (!['lite', 'pro', 'lifetime'].includes(planName)) return next(new ErrorHandler('Invalid plan', 400));
  const user = await User.findById(req.user._id);
  const plan = await Plan.findOne({ name: planName });
  if (!plan) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
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
  const subscription = await Subscription.findOneAndUpdate({ userId: req.user._id }, { planId: plan._id, planName, status: 'active', startDate: new Date(), endDate: planName === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, { new: true });
  await sendSubscriptionConfirmation(user, plan);
  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.SUBSCRIPTION_CREATED, subscription });
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.subscription.plan = 'free';
  user.subscription.status = 'cancelled';
  user.limits = PLAN_FEATURES.free;
  await user.save();
  const subscription = await Subscription.findOneAndUpdate({ userId: req.user._id }, { status: 'cancelled', cancellationReason: req.body.reason || 'Cancelled', cancelledAt: new Date() }, { new: true });
  res.status(200).json({ success: true, message: 'Cancelled', subscription });
});

export const checkFeatureAccess = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const features = PLAN_FEATURES[user.subscription.plan];
  const hasAccess = features[req.query.feature];
  res.status(200).json({ success: true, feature: req.query.feature, hasAccess: hasAccess !== false, planName: user.subscription.plan });
});
