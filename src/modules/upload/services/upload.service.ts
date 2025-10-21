import { Injectable, BadRequestException } from '@nestjs/common';

import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '../../../common/constants/file.constant';
import { FileType } from '../../../common/enums/file-type.enum';
import { Paginated } from '../../../common/interfaces/api-response.interface';
import { PaginationUtil } from '../../../common/utils/pagination.util';
import { CloudinaryService } from '../../externals/cloudinary/services/cloudinary.service';
import { UploadQueryDto } from '../dto/upload-query.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
import { UploadListItemDto } from '../dto/response/upload-list-item.dto';
import { UploadRepository } from '../repositories/upload.repository';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Upload CV and project files
   * Returns file IDs after successful upload to Cloudinary and metadata storage
   */
  async uploadFiles(files: {
    cv?: Express.Multer.File[];
    project?: Express.Multer.File[];
  }): Promise<UploadResponseDto> {
    // Validate files presence
    if (!files.cv || !files.project) {
      throw new BadRequestException('Both CV and project files are required');
    }

    const cvFile = files.cv[0];
    const projectFile = files.project[0];

    // Validate file types
    if (
      cvFile.mimetype !== ALLOWED_MIME_TYPES.pdf ||
      projectFile.mimetype !== ALLOWED_MIME_TYPES.pdf
    ) {
      throw new BadRequestException('Both CV and project files must be PDF');
    }

    // Validate file sizes
    if (cvFile.size > MAX_FILE_SIZE || projectFile.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Upload files to Cloudinary in parallel
    const [cvUploadResult, projectUploadResult] = await Promise.all([
      this.cloudinaryService.uploadFile(cvFile, 'cv'),
      this.cloudinaryService.uploadFile(projectFile, 'project'),
    ]);

    // Save file metadata to database in parallel
    const [cvFileRecord, projectFileRecord] = await Promise.all([
      this.uploadRepository.create({
        cloudinaryPublicId: cvUploadResult.publicId,
        cloudinaryUrl: cvUploadResult.url,
        fileType: FileType.CV,
        fileSize: cvUploadResult.fileSize,
        originalName: cvFile.originalname,
      }),
      this.uploadRepository.create({
        cloudinaryPublicId: projectUploadResult.publicId,
        cloudinaryUrl: projectUploadResult.url,
        fileType: FileType.PROJECT,
        fileSize: projectUploadResult.fileSize,
        originalName: projectFile.originalname,
      }),
    ]);

    return UploadResponseDto.from(cvFileRecord.id, projectFileRecord.id);
  }

  /**
   * Get paginated list of uploads
   * Returns upload records with pagination metadata
   */
  async getList(query: UploadQueryDto): Promise<Paginated<UploadListItemDto>> {
    const { uploads, totalUploads } = await this.uploadRepository.getList(
      query.page,
      query.limit,
    );

    return {
      metadata: PaginationUtil.mapMetadata({
        count: totalUploads,
        page: query.page,
        perPage: query.limit,
      }),
      items: UploadListItemDto.fromList(uploads),
    };
  }
}

