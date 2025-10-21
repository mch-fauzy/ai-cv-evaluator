import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { PAGINATION } from '../constants/pagination.constant';

const {
  defaultPage,
  defaultLimit,
  defaultUpperLimit,
} = PAGINATION;

/**
 * Preprocess function to handle non-numeric pagination values.
 * Converts non-numeric inputs to default values.
 * 
 * @param defaultValue - The default value to use if input is not a valid number
 * @param max - Optional maximum value to enforce
 * @returns Zod preprocess schema that coerces to number with validation
 */
const preprocessPaginationSchema = (defaultValue: number, max?: number) => {
  return z.preprocess((val: unknown) => {
    const parsed = Number(val);
    return isNaN(parsed) ? defaultValue : parsed;
  }, max ? z.number().int().positive().max(max) : z.number().int().positive());
};

export const paginationSchema = z.object({
  page: preprocessPaginationSchema(defaultPage),
  limit: preprocessPaginationSchema(defaultLimit, defaultUpperLimit),
});

export class PaginationDto extends createZodDto(paginationSchema) {}
