import InterviewProgress from '../models/InterviewProgress.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants.js';

// Create Interview Progress
export const createInterviewProgress = asyncHandler(async (req, res, next) => {
  const { category, question, answer, difficulty, notes } = req.body;
  const userId = req.user._id;

  const interviewProgress = await InterviewProgress.create({
    userId,
    category,
    question,
    answer,
    difficulty: difficulty || 'medium',
    notes,
  });

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.CREATED,
    interviewProgress,
  });
});

// Get All Interview Progress
export const getAllInterviewProgress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { category, isFavorite, isCompleted } = req.query;

  let filter = { userId };
  if (category) filter.category = category;
  if (isFavorite) filter.isFavorite = isFavorite === 'true';
  if (isCompleted) filter.isCompleted = isCompleted === 'true';

  const interviewProgress = await InterviewProgress.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: interviewProgress.length,
    interviewProgress,
  });
});

// Get Interview Progress by ID
export const getInterviewProgressById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const interviewProgress = await InterviewProgress.findOne({ _id: id, userId });

  if (!interviewProgress) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    interviewProgress,
  });
});

// Update Interview Progress
export const updateInterviewProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { isFavorite, isCompleted, answer, notes } = req.body;

  let interviewProgress = await InterviewProgress.findOne({ _id: id, userId });

  if (!interviewProgress) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  if (isFavorite !== undefined) interviewProgress.isFavorite = isFavorite;
  if (isCompleted !== undefined) {
    interviewProgress.isCompleted = isCompleted;
    if (isCompleted) interviewProgress.reviewCount += 1;
    interviewProgress.lastReviewedAt = new Date();
  }
  if (answer) interviewProgress.answer = answer;
  if (notes) interviewProgress.notes = notes;

  await interviewProgress.save();

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATED,
    interviewProgress,
  });
});

// Delete Interview Progress
export const deleteInterviewProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const interviewProgress = await InterviewProgress.findOne({ _id: id, userId });

  if (!interviewProgress) {
    return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  }

  await InterviewProgress.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.DELETED,
  });
});

// Get Interview Questions by Category
export const getQuestionsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const { difficulty, isPopular } = req.query;

  let filter = { category };
  if (difficulty) filter.difficulty = difficulty;
  if (isPopular) filter.isPopular = isPopular === 'true';

  const questions = await InterviewQuestion.find(filter).limit(20);

  res.status(200).json({
    success: true,
    count: questions.length,
    questions,
  });
});

// Get Interview Statistics
export const getInterviewStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const totalQuestions = await InterviewProgress.countDocuments({ userId });
  const completedQuestions = await InterviewProgress.countDocuments({ userId, isCompleted: true });
  const favoriteQuestions = await InterviewProgress.countDocuments({ userId, isFavorite: true });

  const byCategory = await InterviewProgress.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$isCompleted', 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalQuestions,
      completedQuestions,
      completionRate: totalQuestions > 0 ? ((completedQuestions / totalQuestions) * 100).toFixed(2) : 0,
      favoriteQuestions,
      byCategory,
    },
  });
});
