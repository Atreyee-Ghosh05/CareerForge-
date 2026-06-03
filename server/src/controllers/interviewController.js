import InterviewProgress from '../models/InterviewProgress.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants.js';

export const createInterviewProgress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { category, question, answer, difficulty, notes } = req.body;
  const progress = await InterviewProgress.create({ userId, category, question, answer, difficulty: difficulty || 'medium', notes });
  res.status(201).json({ success: true, message: SUCCESS_MESSAGES.CREATED, progress });
});

export const getAllInterviewProgress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { category, isFavorite, isCompleted } = req.query;
  let filter = { userId };
  if (category) filter.category = category;
  if (isFavorite) filter.isFavorite = isFavorite === 'true';
  if (isCompleted) filter.isCompleted = isCompleted === 'true';
  const progress = await InterviewProgress.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: progress.length, progress });
});

export const getInterviewProgressById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const progress = await InterviewProgress.findOne({ _id: id, userId });
  if (!progress) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  res.status(200).json({ success: true, progress });
});

export const updateInterviewProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { isFavorite, isCompleted, answer, notes } = req.body;
  let progress = await InterviewProgress.findOne({ _id: id, userId });
  if (!progress) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  if (isFavorite !== undefined) progress.isFavorite = isFavorite;
  if (isCompleted !== undefined) {
    progress.isCompleted = isCompleted;
    if (isCompleted) progress.reviewCount += 1;
    progress.lastReviewedAt = new Date();
  }
  if (answer) progress.answer = answer;
  if (notes) progress.notes = notes;
  await progress.save();
  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.UPDATED, progress });
});

export const deleteInterviewProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const progress = await InterviewProgress.findOne({ _id: id, userId });
  if (!progress) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  await InterviewProgress.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.DELETED });
});

export const getQuestionsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const { difficulty, isPopular } = req.query;
  let filter = { category };
  if (difficulty) filter.difficulty = difficulty;
  if (isPopular) filter.isPopular = isPopular === 'true';
  const questions = await InterviewQuestion.find(filter).limit(20);
  res.status(200).json({ success: true, count: questions.length, questions });
});

export const getInterviewStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const total = await InterviewProgress.countDocuments({ userId });
  const completed = await InterviewProgress.countDocuments({ userId, isCompleted: true });
  const favorites = await InterviewProgress.countDocuments({ userId, isFavorite: true });
  const byCategory = await InterviewProgress.aggregate([
    { $match: { userId } },
    { $group: { _id: '$category', total: { $sum: 1 }, completed: { $sum: { $cond: ['$isCompleted', 1, 0] } } } },
  ]);
  res.status(200).json({ success: true, stats: { total, completed, completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0, favorites, byCategory } });
});
