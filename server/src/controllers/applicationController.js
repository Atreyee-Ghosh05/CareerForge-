import Application from '../models/Application.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PLAN_FEATURES } from '../utils/constants.js';
import { updateUserAnalytics } from '../utils/analyticsHelper.js';

// Create Application
export const createApplication = asyncHandler(async (req, res, next) => {
  const { company, role, status, dateApplied, location, jobUrl, notes } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  // Check application limit
  const userApplications = await Application.countDocuments({ userId });
  const limit = PLAN_FEATURES[user.subscription.plan].applications;

  if (limit !== -1 && userApplications >= limit) {
    return next(
      new ErrorHandler(
        `You have reached your application limit. Upgrade to premium for unlimited applications.`,
        400
      )
    );
  }

  const application = await Application.create({
    userId,
    company,
    role,
    status: status || 'applied',
    dateApplied: dateApplied || Date.now(),
    location,
    jobUrl,
    notes,
  });

  // Update analytics
  await updateUserAnalytics(userId);

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.CREATED,
    application,
  });
});

// Get All Applications
export const getAllApplications = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { status, company } = req.query;

  let filter = { userId };
  if (status) filter.status = status;
  if (company) filter.company = new RegExp(company, 'i');

  const applications = await Application.find(filter).sort({ dateApplied: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

// Get Application by ID
export const getApplicationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const application = await Application.findOne({ _id: id, userId }).populate('resumeUsed');

  if (!application) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    application,
  });
});

// Update Application
export const updateApplication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  let application = await Application.findOne({ _id: id, userId });

  if (!application) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  application = await Application.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  // Update analytics if status changed
  await updateUserAnalytics(userId);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATED,
    application,
  });
});

// Delete Application
export const deleteApplication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const application = await Application.findOne({ _id: id, userId });

  if (!application) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  await Application.findByIdAndDelete(id);

  // Update analytics
  await updateUserAnalytics(userId);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.DELETED,
  });
});

// Get Application Statistics
export const getApplicationStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const totalApplications = await Application.countDocuments({ userId });
  const appliedCount = await Application.countDocuments({ userId, status: 'applied' });
  const assessmentCount = await Application.countDocuments({ userId, status: 'assessment' });
  const interviewCount = await Application.countDocuments({ userId, status: 'interview' });
  const rejectedCount = await Application.countDocuments({ userId, status: 'rejected' });
  const offersCount = await Application.countDocuments({ userId, status: 'offer' });

  const successRate = totalApplications > 0 ? ((offersCount / totalApplications) * 100).toFixed(2) : 0;
  const interviewRate = totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    stats: {
      totalApplications,
      appliedCount,
      assessmentCount,
      interviewCount,
      rejectedCount,
      offersCount,
      successRate: parseFloat(successRate),
      interviewRate: parseFloat(interviewRate),
    },
  });
});
