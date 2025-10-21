import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Zod schema for evaluation request
 */
export const createEvaluationSchema = z.object({
  jobTitle: z.string().min(1).max(200),
  cvFileId: z.uuid(),
  projectFileId: z.uuid(),
});

/**
 * Create evaluation request DTO
 * Initiates an async evaluation job
 */
export class CreateEvaluationDto extends createZodDto(createEvaluationSchema) {}
