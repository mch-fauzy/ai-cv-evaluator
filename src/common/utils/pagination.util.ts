import { PaginationMetadata } from '../interfaces/metadata.interface';

/**
 * Input interface for pagination calculations.
 * Defines the contract for objects used in pagination metadata mapping.
 */
interface PaginationInput {
  count: number;
  page: number;
  perPage: number;
}

/**
 * Utility class for pagination operations.
 * Provides helper methods for calculating and mapping pagination metadata.
 */
export class PaginationUtil {
  /**
   * Maps the given pagination parameters to a `PaginationMetadata` object.
   *
   * @param params - An object containing pagination calculation parameters.
   * @returns An object containing pagination metadata, including the current page,
   * number of items per page, total number of items, and total number of pages.
   */
  static mapMetadata(params: PaginationInput): PaginationMetadata {
    const page = params.page;
    const perPage = params.perPage;

    return {
      page: page,
      perPage: perPage,
      total: params.count,
      totalPage: Math.ceil(params.count / perPage),
    };
  }
}
