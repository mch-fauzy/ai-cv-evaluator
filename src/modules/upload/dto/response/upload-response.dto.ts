import { z } from 'zod';

/**
 * Zod schema for upload response
 */
export const uploadResponseSchema = z.object({
  cvFileId: z.uuid(),
  reportFileId: z.uuid(),
});

/**
 * Upload response DTO
 * Returns file IDs for uploaded CV and project report
 */
export class UploadResponseDto {
  cvFileId!: string;
  reportFileId!: string;

  static from(cvFileId: string, reportFileId: string): UploadResponseDto {
    const dto = new UploadResponseDto();
    dto.cvFileId = cvFileId;
    dto.reportFileId = reportFileId;
    return dto;
  }
}

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
