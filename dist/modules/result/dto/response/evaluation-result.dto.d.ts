import { z } from 'zod';
export declare const evaluationResultSchema: z.ZodObject<{
    cvMatchRate: z.ZodNumber;
    cvFeedback: z.ZodString;
    projectScore: z.ZodNumber;
    projectFeedback: z.ZodString;
    overallSummary: z.ZodString;
}, z.core.$strip>;
export declare class EvaluationResultDto {
    cvMatchRate: number;
    cvFeedback: string;
    projectScore: number;
    projectFeedback: string;
    overallSummary: string;
    static from(cvMatchRate: number, cvFeedback: string, projectScore: number, projectFeedback: string, overallSummary: string): EvaluationResultDto;
}
