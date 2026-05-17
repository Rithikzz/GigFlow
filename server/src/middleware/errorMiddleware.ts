import { ErrorRequestHandler } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

/**
 * Centralized error handling middleware.
 * Uses Express's ErrorRequestHandler type — no `any` cast needed
 * when registered via app.use().
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req,
  res,
  _next
): void => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;
