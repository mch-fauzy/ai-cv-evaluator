import { PaginationMetadata } from './metadata.interface';

/**
 * Generic interface that represents a response with pagination metadata and a list of items
 */
export interface Paginated<T> {
  metadata: PaginationMetadata;
  items: T[];
}

/**
 * Generic interface that can be used to represent a response with a message and some data.
 * The T is a type parameter, which means it can be replaced with any type when the interface is used.
 */
export interface ApiResult<T> {
  message: string;
  data: T | null;
}
