import { Types } from 'mongoose';
import { Role } from './index.js';

/**
 * Module augmentation for Express Request.
 * This adds a typed `user` property to all Request objects,
 * eliminating the need for a separate AuthenticatedRequest type
 * and removing all `as any` casts on route handlers.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        name: string;
        email: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export {};
