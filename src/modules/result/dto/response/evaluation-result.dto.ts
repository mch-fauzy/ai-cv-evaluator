import { z } from 'zod';

/**
 * Zod schema for evaluation result details
 */
export const evaluationResultSchema = z.object({
  cvMatchRate: z.number().min(0).max(1),
  cvFeedback: z.string(),
  projectScore: z.number().min(1).max(5),
  projectFeedback: z.string(),
  overallSummary: z.string(),
});

/**
 * Evaluation result details
 */
export class EvaluationResultDto {
  cvMatchRate!: number;
  cvFeedback!: string;
  projectScore!: number;
  projectFeedback!: string;
  overallSummary!: string;

  static from(
    cvMatchRate: number,
    cvFeedback: string,
    projectScore: number,
    projectFeedback: string,
    overallSummary: string,
  ): EvaluationResultDto {
    const dto = new EvaluationResultDto();
    dto.cvMatchRate = cvMatchRate;
    dto.cvFeedback = cvFeedback;
    dto.projectScore = projectScore;
    dto.projectFeedback = projectFeedback;
    dto.overallSummary = overallSummary;
    return dto;
  }
}

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
