import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please wait 15 minutes before trying again.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  skip: (req) => req.path === '/health',
});

export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many searches',
    message: 'You can only analyze 10 profiles per minute.',
    code: 'SEARCH_RATE_LIMIT',
  },
});
