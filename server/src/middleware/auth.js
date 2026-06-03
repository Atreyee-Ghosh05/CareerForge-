import User from '../models/User.js';
import { verifyToken } from '../utils/tokenUtils.js';
import ErrorHandler from '../utils/errorHandler.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ErrorHandler(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new ErrorHandler(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    if (user.isSuspended) {
      return next(new ErrorHandler(ERROR_MESSAGES.ACCOUNT_SUSPENDED, 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ErrorHandler(ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new ErrorHandler(ERROR_MESSAGES.FORBIDDEN, 403));
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user && !user.isSuspended) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};
