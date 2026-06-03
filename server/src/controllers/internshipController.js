import Internship from '../models/Internship.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants.js';

export const createInternship = asyncHandler(async (req, res, next) => {
  const { company, role, status, startDate, endDate, duration, location, stipend, jobUrl, description, notes } = req.body;
  const userId = req.user._id;

  const internship = await Internship.create({
    userId,
    company,
    role,
    status: status || 'applied',
    startDate,
    endDate,
    duration,
    location,
    stipend,
    jobUrl,
    description,
    notes,
  });

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.CREATED,
    internship,
  });
});

export const getAllInternships = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { status, company } = req.query;

  let filter = { userId };
  if (status) filter.status = status;
  if (company) filter.company = new RegExp(company, 'i');

  const internships = await Internship.find(filter).sort({ dateApplied: -1 });

  res.status(200).json({
    success: true,
    count: internships.length,
    internships,
  });
});

export const getInternshipById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const internship = await Internship.findOne({ _id: id, userId });

  if (!internship) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    internship,
  });
});

export const updateInternship = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  let internship = await Internship.findOne({ _id: id, userId });

  if (!internship) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  internship = await Internship.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATED,
    internship,
  });
});

export const deleteInternship = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const internship = await Internship.findOne({ _id: id, userId });

  if (!internship) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  await Internship.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.DELETED,
  });
});

export const getInternshipStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const totalInternships = await Internship.countDocuments({ userId });
  const appliedCount = await Internship.countDocuments({ userId, status: 'applied' });
  const shortlistedCount = await Internship.countDocuments({ userId, status: 'shortlisted' });
  const interviewCount = await Internship.countDocuments({ userId, status: 'interview' });
  const rejectedCount = await Internship.countDocuments({ userId, status: 'rejected' });
  const acceptedCount = await Internship.countDocuments({ userId, status: 'accepted' });
  const completedCount = await Internship.countDocuments({ userId, status: 'completed' });

  res.status(200).json({
    success: true,
    stats: {
      totalInternships,
      appliedCount,
      shortlistedCount,
      interviewCount,
      rejectedCount,
      acceptedCount,
      completedCount,
    },
  });
});
