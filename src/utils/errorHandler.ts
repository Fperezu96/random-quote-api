import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export interface ApiError {
  message: string;
  details?: string;
  field?: string;
  statusCode: number;
}

// Error response interfaces for TSOA
export interface ErrorResponse {
  message: string;
  details?: string;
}

export interface ValidationErrorResponse {
  message: string;
  field?: string;
}

export class CustomError extends Error implements ApiError {
  public statusCode: number;
  public details?: string;
  public field?: string;

  constructor(message: string, statusCode: number = 500, details?: string, field?: string) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.details = details;
    this.field = field;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, field?: string) {
    super(message, 400, undefined, field);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, details?: string) {
    super(message, 500, details);
    this.name = 'DatabaseError';
  }
}

// Error handler middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof CustomError) {
    const errorResponse: any = {
      message: err.message
    };

    if (err.details) {
      errorResponse.details = err.details;
    }

    if (err.field) {
      errorResponse.field = err.field;
    }

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);

  // Default error response
  res.status(500).json({
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}
