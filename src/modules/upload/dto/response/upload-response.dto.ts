import { z } from 'zod';

/**
 * Zod schema for upload response
 */
export const uploadResponseSchema = z.object({
  cvFileId: z.uuid(),
  projectFileId: z.uuid(),
});

/**
 * Upload response DTO
 * Returns file IDs for uploaded CV and project file
 */
export class UploadResponseDto {
  cvFileId!: string;
  projectFileId!: string;

  static from(cvFileId: string, projectFileId: string): UploadResponseDto {
    const dto = new UploadResponseDto();
    dto.cvFileId = cvFileId;
    dto.projectFileId = projectFileId;
    return dto;
  }
}

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
