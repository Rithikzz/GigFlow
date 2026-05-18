import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.js';
import { getConfig } from '../config/env.js';

interface ErrorRequest extends Request {
  error?: AppError;
}

type ErrorWithStatus = Error & { statusCode?: number; isOperational?: boolean };

export function errorHandler(
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isOperational = err.isOperational ?? true;
  const statusCode = err.statusCode ?? 500;
  const config = getConfig();

  if (isOperational) {
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorHandler;
