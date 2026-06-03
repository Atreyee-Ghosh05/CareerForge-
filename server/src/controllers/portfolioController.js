import Portfolio from '../models/Portfolio.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants.js';

export const createPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { username, theme } = req.body;
  let portfolio = await Portfolio.findOne({ userId });
  if (portfolio) return next(new ErrorHandler('Portfolio exists', 400));
  portfolio = await Portfolio.create({ userId, username: username || req.user.username, theme: theme || 'modern' });
  res.status(201).json({ success: true, message: SUCCESS_MESSAGES.CREATED, portfolio });
});

export const getUserPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const portfolio = await Portfolio.findOne({ userId }).populate('resume');
  if (!portfolio) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  res.status(200).json({ success: true, portfolio });
});

export const getPortfolioByUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const portfolio = await Portfolio.findOne({ username, isPublished: true }).populate('resume');
  if (!portfolio) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  portfolio.viewCount += 1;
  await portfolio.save();
  res.status(200).json({ success: true, portfolio });
});

export const updatePortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { about, skills, projects, experience, education, socialLinks, contact, theme, isPublished } = req.body;
  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  if (about) portfolio.about = about;
  if (skills) portfolio.skills = skills;
  if (projects) portfolio.projects = projects;
  if (experience) portfolio.experience = experience;
  if (education) portfolio.education = education;
  if (socialLinks) portfolio.socialLinks = socialLinks;
  if (contact) portfolio.contact = contact;
  if (theme) portfolio.theme = theme;
  if (isPublished !== undefined) portfolio.isPublished = isPublished;
  await portfolio.save();
  res.status(200).json({ success: true, message: SUCCESS_MESSAGES.UPDATED, portfolio });
});

export const publishPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  portfolio.isPublished = true;
  await portfolio.save();
  res.status(200).json({ success: true, message: 'Published', portfolio });
});

export const unpublishPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
  portfolio.isPublished = false;
  await portfolio.save();
  res.status(200).json({ success: true, message: 'Unpublished', portfolio });
});
