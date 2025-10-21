import { createZodDto } from 'nestjs-zod';

import { paginationSchema } from '../../../common/dto/pagination.dto';

/**
 * Upload query DTO for list endpoint.
 */
export class UploadQueryDto extends createZodDto(paginationSchema.extend({})) {}
