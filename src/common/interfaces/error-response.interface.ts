/**
 * Simple error response interface
 */
export interface ErrorResponse {
  message: string;
  error?: string | Record<string, unknown>;
  errors?: Record<string, string[]>;
}
