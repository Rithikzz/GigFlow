import { Response } from 'express';

interface ResponseData<T = unknown> {
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export function successResponse<T>(
  res: Response,
  statusCode: number,
  { data, message, meta }: ResponseData<T> = {}
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
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
