import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { JwtPayload } from '../types/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { getConfig } from '../config/env.js';
import AppError from '../utils/appError.js';

export async function protect(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];
  const config = getConfig();

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw AppError.unauthorized('User not found');
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    throw AppError.unauthorized('Not authorized, token invalid or expired');
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized();
      return;
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action');
    }

    next();
  };
}

export default protect;
