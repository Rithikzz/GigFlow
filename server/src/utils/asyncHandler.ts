import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to catch rejected promises
 * and forward them to Express error middleware.
 * Eliminates repetitive try-catch blocks in controllers.
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
