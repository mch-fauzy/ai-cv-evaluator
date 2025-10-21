import { z } from 'zod';
import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
export declare const evaluationResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    status: z.ZodEnum<typeof EvaluationStatus>;
}, z.core.$strip>;
export declare class EvaluationResponseDto {
    id: string;
    status: EvaluationStatus;
    static from(id: string, status: EvaluationStatus): EvaluationResponseDto;
}
