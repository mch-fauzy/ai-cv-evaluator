import { FileType } from '../../../../common/enums/file-type.enum';
import type { Upload } from '../../entities/upload.entity';

/**
 * Upload list item DTO
 * Returns simplified upload data for list endpoints
 */
export class UploadListItemDto {
  id!: string;
  cloudinaryUrl!: string;
  fileType!: FileType;
  originalName!: string;

  static from(upload: Upload): UploadListItemDto {
    const dto = new UploadListItemDto();
    dto.id = upload.id;
    dto.cloudinaryUrl = upload.cloudinaryUrl;
    dto.fileType = upload.fileType;
    dto.originalName = upload.originalName;
    return dto;
  }

  static fromList(uploads: Upload[]): UploadListItemDto[] {
    return uploads.map((upload) => this.from(upload));
  }
}
