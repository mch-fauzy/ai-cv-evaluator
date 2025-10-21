import { z } from 'zod';

import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';

/**
 * Zod schema for evaluation response
 */
export const evaluationResponseSchema = z.object({
  id: z.uuid(),
  status: z.enum(EvaluationStatus),
});

/**
 * Evaluation response DTO
 * Returns evaluation ID and current status
 */
export class EvaluationResponseDto {
  id!: string;
  status!: EvaluationStatus;

  static from(id: string, status: EvaluationStatus): EvaluationResponseDto {
    const dto = new EvaluationResponseDto();
    dto.id = id;
    dto.status = status;
    return dto;
  }
}

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;
