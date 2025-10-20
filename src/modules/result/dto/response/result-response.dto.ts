import { z } from 'zod';
import { evaluationResultSchema, EvaluationResultDto } from './evaluation-result.dto';
import { jobStatusSchema } from '../../../evaluation/dto/response/evaluation-response.dto';

/**
 * Zod schema for result response (pending)
 */
export const resultResponsePendingSchema = z.object({
  id: z.uuid(),
  status: z.enum(['queued', 'processing']),
});

/**
 * Zod schema for result response (completed)
 */
export const resultResponseCompletedSchema = z.object({
  id: z.uuid(),
  status: z.literal('completed'),
  result: evaluationResultSchema,
});

/**
 * Zod schema for result response (failed)
 */
export const resultResponseFailedSchema = z.object({
  id: z.uuid(),
  status: z.literal('failed'),
  error: z.string().optional(),
});

/**
 * Combined result response schema
 */
export const resultResponseSchema = z.discriminatedUnion('status', [
  resultResponsePendingSchema,
  resultResponseCompletedSchema,
  resultResponseFailedSchema,
]);

/**
 * Result response DTO (pending status)
 */
export class ResultResponsePendingDto {
  id!: string;
  status!: 'queued' | 'processing';

  static from(id: string, status: 'queued' | 'processing'): ResultResponsePendingDto {
    const dto = new ResultResponsePendingDto();
    dto.id = id;
    dto.status = status;
    return dto;
  }
}

/**
 * Result response DTO (completed status)
 */
export class ResultResponseCompletedDto {
  id!: string;
  status!: 'completed';
  result!: EvaluationResultDto;

  static from(id: string, result: EvaluationResultDto): ResultResponseCompletedDto {
    const dto = new ResultResponseCompletedDto();
    dto.id = id;
    dto.status = 'completed';
    dto.result = result;
    return dto;
  }
}

/**
 * Result response DTO (failed status)
 */
export class ResultResponseFailedDto {
  id!: string;
  status!: 'failed';
  error?: string;

  static from(id: string, error?: string): ResultResponseFailedDto {
    const dto = new ResultResponseFailedDto();
    dto.id = id;
    dto.status = 'failed';
    dto.error = error;
    return dto;
  }
}

export type ResultResponse = z.infer<typeof resultResponseSchema>;
export type ResultResponsePending = z.infer<typeof resultResponsePendingSchema>;
export type ResultResponseCompleted = z.infer<typeof resultResponseCompletedSchema>;
export type ResultResponseFailed = z.infer<typeof resultResponseFailedSchema>;
