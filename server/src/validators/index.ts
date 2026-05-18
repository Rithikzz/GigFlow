import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import AppError from '../utils/appError.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'SALES']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const createLeadSchema = z.object({
  name: z.string().min(2, 'Lead name is required'),
  email: z.string().email('Invalid email'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']).optional(),
  source: z.enum(['WEBSITE', 'INSTAGRAM', 'REFERRAL']),
  assignedTo: z.string().regex(/^[a-fA-F0-9]{24}$/, 'assignedTo must be a valid ObjectId').optional(),
});

const updateLeadSchema = createLeadSchema.partial();

const leadQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .refine((value) => !value || (Number.isInteger(Number(value)) && Number(value) > 0), 'Invalid page number'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']).optional(),
  source: z.enum(['WEBSITE', 'INSTAGRAM', 'REFERRAL']).optional(),
  sort: z.enum(['latest', 'oldest']).optional(),
  search: z.string().optional(),
});

const validate =
  <T>(schema: z.ZodSchema<T>, target: 'body' | 'query') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      next(AppError.badRequest(message));
      return;
    }
    if (target === 'query') {
      // In Express 5, req.query is a read-only getter property. We modify its keys in-place.
      const currentQuery = req.query as Record<string, unknown>;
      for (const key of Object.keys(currentQuery)) {
        delete currentQuery[key];
      }
      const validatedData = result.data as Record<string, unknown>;
      for (const key of Object.keys(validatedData)) {
        currentQuery[key] = validatedData[key];
      }
    } else {
      req[target] = result.data as Request[typeof target];
    }
    next();
  };

export const validateRegister = validate(registerSchema, 'body');
export const validateLogin = validate(loginSchema, 'body');
export const validateCreateLead = validate(createLeadSchema, 'body');
export const validateUpdateLead = validate(updateLeadSchema, 'body');
export const validateLeadQuery = validate(leadQuerySchema, 'query');
