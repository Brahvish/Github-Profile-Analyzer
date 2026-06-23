import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 500;

    if (status === 404) {
      res.status(404).json({
        error: 'GitHub user not found',
        message: 'The requested GitHub username does not exist.',
        code: 'USER_NOT_FOUND',
      });
      return;
    }

    if (status === 403) {
      res.status(429).json({
        error: 'GitHub rate limit exceeded',
        message: 'GitHub API rate limit reached. Please try again in an hour.',
        code: 'GITHUB_RATE_LIMIT',
        retryAfter: err.response?.headers?.['x-ratelimit-reset'],
      });
      return;
    }

    if (status === 422) {
      res.status(422).json({
        error: 'Invalid username',
        message: 'The provided username is not valid.',
        code: 'INVALID_USERNAME',
      });
      return;
    }
  }

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    code: err.code ?? 'INTERNAL_ERROR',
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
}
