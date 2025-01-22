import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.name === 'ValidationError') {
      // Handle Mongoose ValidationError
      const errors = Object.entries(exception.errors).map(([field, error]) => ({
        name: field,
        message: (error as any).message,
      }));

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors,
      });
    }

    if (exception.code === 11000) {
      // Handle Mongoose duplicate key error
      const keyValue = exception.keyValue || {};
      const field = Object.keys(keyValue)[0];
      const value = keyValue[field];

      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate key error',
        error: `${field} with value "${value}" already exists.`,
        details: {
          field,
          value,
        },
      });
    }

    if (exception instanceof HttpException) {
      // Handle NestJS HttpException
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle BadRequestException with detailed validation errors
      if (status === HttpStatus.BAD_REQUEST && exceptionResponse) {
        const { message, error } = exceptionResponse as {
          message: string[] | string;
          error: string;
        };

        return response.status(status).json({
          statusCode: status,
          message: error || 'Bad Request',
          errors: Array.isArray(message)
            ? message.map((msg) => ({ message: msg }))
            : [{ message }],
        });
      }

      // Generic HttpException handling
      return response.status(status).json({
        statusCode: status,
        message: exception.message || 'An error occurred',
        ...(exceptionResponse && typeof exceptionResponse === 'object'
          ? { errors: exceptionResponse }
          : {}),
      });
    }

    // Fallback for unhandled exceptions
    console.error(exception); // Log the error for debugging
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
