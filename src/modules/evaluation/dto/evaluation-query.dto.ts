import { createZodDto } from 'nestjs-zod';

import { paginationSchema } from '../../../common/dto/pagination.dto';

/**
 * Evaluation query DTO for list endpoint.
 */
export class EvaluationQueryDto extends createZodDto(
  paginationSchema.extend({}),
) {}
