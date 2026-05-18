import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import AppError from '../utils/appError.js';
import { getConfig } from '../config/env.js';

const generateToken = (id: string): string => {
  const config = getConfig();
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: '1h' });
};

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'SALES';
  };

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw AppError.conflict('Email already in use');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role ?? 'SALES',
  });

  res.status(201).json({
    status: 'success',
    token: generateToken(user._id.toString()),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid credentials');
  }

  res.status(200).json({
    status: 'success',
    token: generateToken(user._id.toString()),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw AppError.unauthorized('Not authorized');
  }

  res.status(200).json({
    status: 'success',
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
});
