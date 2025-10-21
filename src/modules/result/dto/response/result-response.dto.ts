import { z } from 'zod';

import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { evaluationResultSchema, EvaluationResultDto } from './evaluation-result.dto';

/**
 * Unified Zod schema for result response
 * All statuses return the same structure with result being null or data
 */
export const resultResponseSchema = z.object({
  id: z.uuid(),
  status: z.enum(EvaluationStatus),
  result: evaluationResultSchema.nullable(),
});

/**
 * Unified Result response DTO
 * Provides a consistent JSON schema across all evaluation statuses
 */
export class ResultResponseDto {
  id!: string;
  status!: EvaluationStatus;
  result!: EvaluationResultDto | null;

  static fromPending(
    id: string,
    status: EvaluationStatus.PENDING | EvaluationStatus.IN_PROGRESS,
  ): ResultResponseDto {
    const dto = new ResultResponseDto();
    dto.id = id;
    dto.status = status;
    dto.result = null;
    return dto;
  }

  static fromCompleted(id: string, result: EvaluationResultDto): ResultResponseDto {
    const dto = new ResultResponseDto();
    dto.id = id;
    dto.status = EvaluationStatus.COMPLETED;
    dto.result = result;
    return dto;
  }

  static fromFailed(id: string): ResultResponseDto {
    const dto = new ResultResponseDto();
    dto.id = id;
    dto.status = EvaluationStatus.FAILED;
    dto.result = null;
    return dto;
  }
}
