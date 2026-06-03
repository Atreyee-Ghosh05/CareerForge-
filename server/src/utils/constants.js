export const PLAN_FEATURES = {
  free: {
    resumes: 2,
    applications: 15,
    templates: 3,
    portfolioBuilder: false,
    intershipTracker: false,
    advancedInterviewPrep: false,
    careerAnalytics: false,
    portfolioThemes: 1,
    pdfWatermark: true,
    prioritySupport: false,
  },
  lite: {
    resumes: -1,
    applications: -1,
    templates: -1,
    portfolioBuilder: false,
    intershipTracker: true,
    advancedInterviewPrep: false,
    careerAnalytics: false,
    portfolioThemes: 1,
    pdfWatermark: false,
    prioritySupport: false,
  },
  pro: {
    resumes: -1,
    applications: -1,
    templates: -1,
    portfolioBuilder: true,
    intershipTracker: true,
    advancedInterviewPrep: true,
    careerAnalytics: true,
    portfolioThemes: 3,
    pdfWatermark: false,
    prioritySupport: true,
  },
  lifetime: {
    resumes: -1,
    applications: -1,
    templates: -1,
    portfolioBuilder: true,
    intershipTracker: true,
    advancedInterviewPrep: true,
    careerAnalytics: true,
    portfolioThemes: 3,
    pdfWatermark: false,
    prioritySupport: true,
  },
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PAUSED: 'paused',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  ASSESSMENT: 'assessment',
  INTERVIEW: 'interview',
  REJECTED: 'rejected',
  OFFER: 'offer',
};

export const INTERVIEW_CATEGORIES = {
  HR: 'hr',
  SOFTWARE: 'software',
  FINANCE: 'finance',
  MARKETING: 'marketing',
  DATA_SCIENCE: 'data-science',
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  EMAIL_NOT_VERIFIED: 'Please verify your email first',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  LIMIT_EXCEEDED: 'You have exceeded your plan limit',
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_SENT: 'Email sent successfully',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
};
