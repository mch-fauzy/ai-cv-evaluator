import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadResponseDto } from '../dto/response/upload-response.dto';

@Injectable()
export class UploadService {
  /**
   * Upload CV and project report files
   * Returns file IDs after successful upload to Cloudinary and metadata storage
   */
  async uploadFiles(files: {
    cv?: Express.Multer.File[];
    report?: Express.Multer.File[];
  }): Promise<UploadResponseDto> {
    // Validate files presence
    if (!files.cv || !files.report) {
      throw new BadRequestException('Both CV and report files are required');
    }

    const cvFile = files.cv[0];
    const reportFile = files.report[0];

    // Validate file types
    if (cvFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('CV must be a PDF file');
    }

    if (reportFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('Report must be a PDF file');
    }

    // TODO: Implement in Stage 2
    // - Upload to Cloudinary
    // - Save metadata to database
    // - Return actual file IDs

    throw new Error('Upload functionality not yet implemented - Stage 2');
  }
}
