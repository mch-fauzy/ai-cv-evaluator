import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * RFC7807 Problem Details interface
 */
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: unknown;
}

/**
 * Global exception filter that returns RFC7807 ProblemDetails format
 * Provides consistent error responses across the entire API
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let problemDetails: ProblemDetails = {
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Internal Server Error',
      status,
      detail: 'An unexpected error occurred',
      instance: request.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        
        // If already ProblemDetails format, use it
        if ('type' in responseObj && 'title' in responseObj) {
          problemDetails = {
            ...problemDetails,
            ...responseObj,
            status,
            instance: request.url,
          } as ProblemDetails;
        } else {
          // Convert standard NestJS error to ProblemDetails
          problemDetails = {
            type: 'https://tools.ietf.org/html/rfc7807',
            title: this.getHttpStatusTitle(status),
            status,
            detail: (responseObj.message as string) || exception.message,
            instance: request.url,
            errors: responseObj.error,
          };
        }
      } else {
        problemDetails = {
          type: 'https://tools.ietf.org/html/rfc7807',
          title: this.getHttpStatusTitle(status),
          status,
          detail: exception.message,
          instance: request.url,
        };
      }
    } else if (exception instanceof Error) {
      // Handle non-HTTP errors
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
      problemDetails = {
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Internal Server Error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        detail:
          process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : exception.message,
        instance: request.url,
      };
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json(problemDetails);
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
}
