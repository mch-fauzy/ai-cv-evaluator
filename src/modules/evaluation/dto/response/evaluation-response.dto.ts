import { z } from 'zod';

/**
 * Job status enum
 */
export const jobStatusSchema = z.enum([
  'queued',
  'processing',
  'completed',
  'failed',
]);

/**
 * Zod schema for evaluation response
 */
export const evaluationResponseSchema = z.object({
  id: z.uuid(),
  status: jobStatusSchema,
});

/**
 * Evaluation response DTO
 * Returns job ID and initial status
 */
export class EvaluationResponseDto {
  id!: string;
  status!: 'queued' | 'processing' | 'completed' | 'failed';

  static from(
    id: string,
    status: 'queued' | 'processing' | 'completed' | 'failed',
  ): EvaluationResponseDto {
    const dto = new EvaluationResponseDto();
    dto.id = id;
    dto.status = status;
    return dto;
  }
}

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
