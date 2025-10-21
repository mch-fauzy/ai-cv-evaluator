import { z } from 'zod';
export declare const createEvaluationSchema: z.ZodObject<{
    jobTitle: z.ZodString;
    cvFileId: z.ZodUUID;
    projectFileId: z.ZodUUID;
}, z.core.$strip>;
declare const CreateEvaluationDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    jobTitle: z.ZodString;
    cvFileId: z.ZodUUID;
    projectFileId: z.ZodUUID;
}, z.core.$strip>> & {
    io: "input";
};
export declare class CreateEvaluationDto extends CreateEvaluationDto_base {
}
export {};
