import { z } from 'zod';
export declare const uploadResponseSchema: z.ZodObject<{
    cvFileId: z.ZodUUID;
    projectFileId: z.ZodUUID;
}, z.core.$strip>;
export declare class UploadResponseDto {
    cvFileId: string;
    projectFileId: string;
    static from(cvFileId: string, projectFileId: string): UploadResponseDto;
}
