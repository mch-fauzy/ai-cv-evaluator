/**
 * Pagination metadata interface.
 * Contains information about pagination state.
 */
export interface PaginationMetadata {
  page: number;
  perPage: number;
  total: number;
  totalPage: number;
}
