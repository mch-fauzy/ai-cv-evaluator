import { z } from 'zod';
import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { EvaluationResultDto } from './evaluation-result.dto';
export declare const resultResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    status: z.ZodEnum<typeof EvaluationStatus>;
    result: z.ZodNullable<z.ZodObject<{
        cvMatchRate: z.ZodNumber;
        cvFeedback: z.ZodString;
        projectScore: z.ZodNumber;
        projectFeedback: z.ZodString;
        overallSummary: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare class ResultResponseDto {
    id: string;
    status: EvaluationStatus;
    result: EvaluationResultDto | null;
    static fromPending(id: string, status: EvaluationStatus.PENDING | EvaluationStatus.IN_PROGRESS): ResultResponseDto;
    static fromCompleted(id: string, result: EvaluationResultDto): ResultResponseDto;
    static fromFailed(id: string): ResultResponseDto;
}
