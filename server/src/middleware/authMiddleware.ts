import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { JwtPayload, Role } from '../types/index.js';
import { getConfig } from '../config/env.js';
import AppError from '../utils/appError.js';

export async function protect(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(AppError.unauthorized('Not authorized, token missing'));
    return;
  }

  const token = authHeader.split(' ')[1];
  const config = getConfig();

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      next(AppError.unauthorized('User not found'));
      return;
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(AppError.unauthorized('Not authorized, token invalid or expired'));
    }
  }
}

export function authorizeRoles(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(AppError.forbidden('You do not have permission to perform this action'));
      return;
    }

    next();
  };
}

export default protect;
