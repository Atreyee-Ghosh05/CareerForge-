import Resume from '../models/Resume.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PLAN_FEATURES } from '../utils/constants.js';

// Create Resume
export const createResume = asyncHandler(async (req, res, next) => {
  const { title, template } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  // Check resume limit
  const userResumes = await Resume.countDocuments({ userId });
  const limit = PLAN_FEATURES[user.subscription.plan].resumes;

  if (limit !== -1 && userResumes >= limit) {
    return next(
      new ErrorHandler(
        `You have reached your resume limit. Upgrade to premium for unlimited resumes.`,
        400
      )
    );
  }

  const resume = await Resume.create({
    userId,
    title,
    template,
  });

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.CREATED,
    resume,
  });
});

// Get All Resumes
export const getAllResumes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const resumes = await Resume.find({ userId });

  res.status(200).json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

// Get Resume by ID
export const getResumeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    resume,
  });
});

// Update Resume
export const updateResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  let resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  resume = await Resume.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATED,
    resume,
  });
});

// Delete Resume
export const deleteResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  await Resume.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.DELETED,
  });
});

// Download Resume (PDF)
export const downloadResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Increment download count
  resume.downloadCount += 1;
  await resume.save();

  // TODO: Implement PDF generation logic
  res.status(200).json({
    success: true,
    message: 'Resume PDF generated',
    resume,
  });
});

// Set Primary Resume
export const setPrimaryResume = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const resume = await Resume.findOne({ _id: id, userId });

  if (!resume) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Remove primary from all resumes
  await Resume.updateMany({ userId }, { isPrimary: false });

  // Set as primary
  resume.isPrimary = true;
  await resume.save();

  res.status(200).json({
    success: true,
    message: 'Primary resume updated',
    resume,
  });
});
