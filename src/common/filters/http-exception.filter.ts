import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import type { ErrorResponse } from '../interfaces/error-response.interface';

/**
 * Global exception filter that returns simple, consistent error responses
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      message: 'Internal Server Error',
      error: 'An unexpected error occurred',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        
        // Handle validation errors (array of messages)
        if (Array.isArray(responseObj.message)) {
          errorResponse = {
            message: this.getHttpStatusTitle(status),
            errors: this.formatValidationErrors(responseObj.message as string[]),
          };
        } else {
          errorResponse = {
            message: this.getHttpStatusTitle(status),
            error: (responseObj.message as string) || exception.message,
          };
        }
      } else {
        errorResponse = {
          message: this.getHttpStatusTitle(status),
          error: exception.message,
        };
      }
    } else if (exception instanceof Error) {
      // Handle non-HTTP errors (500 errors)
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
      errorResponse = {
        message: 'Internal Server Error',
        error:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : exception.message,
      };
    }

    // Only log server errors (5xx), not client errors (4xx)
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Get human-readable title for HTTP status code
   */
  private getHttpStatusTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };

    return titles[status] || 'Error';
  }

  /**
   * Format validation errors into a structured object
   * Converts ["field1 should be...", "field2 should be..."] 
   * to { field1: ["should be..."], field2: ["should be..."] }
   */
  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    messages.forEach((msg) => {
      // Try to extract field name from message like "fieldName should be..."
      const match = msg.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const [, field, error] = match;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(error);
      } else {
        // If no field found, use 'general' key
        if (!errors.general) {
          errors.general = [];
        }
        errors.general.push(msg);
      }
    });

    return errors;
  }
}
