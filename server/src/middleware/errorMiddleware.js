import ErrorHandler from '../utils/errorHandler.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = ERROR_MESSAGES.NOT_FOUND;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    err = new ErrorHandler(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = ERROR_MESSAGES.UNAUTHORIZED;
    err = new ErrorHandler(message, 401);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
