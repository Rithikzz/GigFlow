import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export const healthCheck = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Server running successfully',
  });
});

export default healthCheck;
