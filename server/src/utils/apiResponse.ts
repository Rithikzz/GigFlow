import { Response } from 'express';

interface ResponseData<T = unknown> {
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    perPage: number;
  };
}

export function successResponse<T>(
  res: Response,
  statusCode: number,
  { data, message, pagination }: ResponseData<T> = {}
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  });
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string
): void {
  res.status(statusCode).json({
    success: false,
    message,
  });
}
