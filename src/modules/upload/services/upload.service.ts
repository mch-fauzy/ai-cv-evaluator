import { Injectable, BadRequestException } from '@nestjs/common';

import { FileType } from '../../../common/enums/file-type.enum';
import { Paginated } from '../../../common/interfaces/api-response.interface';
import { PaginationUtil } from '../../../common/utils/pagination.util';
import { CloudinaryService } from '../../externals/cloudinary/services/cloudinary.service';
import { UploadQueryDto } from '../dto/upload-query.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
import { UploadListItemDto } from '../dto/response/upload-list-item.dto';
import { UploadRepository } from '../repositories/upload.repository';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
    if (cvFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('CV must be a PDF file');
    }

    if (projectFile.mimetype !== 'application/pdf') {
      throw new BadRequestException('Project file must be a PDF file');
    }

    // Validate file sizes
    if (cvFile.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `CV file size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (projectFile.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Project file size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Upload CV to Cloudinary
    const cvUploadResult = await this.cloudinaryService.uploadFile(
      cvFile,
      'cv',
    );

    // Upload Project file to Cloudinary
    const projectUploadResult = await this.cloudinaryService.uploadFile(
      projectFile,
      'project',
    );

    // Save CV metadata to database
    const cvFileRecord = await this.uploadRepository.create({
      cloudinaryPublicId: cvUploadResult.publicId,
      cloudinaryUrl: cvUploadResult.url,
      fileType: FileType.CV,
      fileSize: cvUploadResult.fileSize,
      originalName: cvFile.originalname,
    });

    // Save Project file metadata to database
    const projectFileRecord = await this.uploadRepository.create({
      cloudinaryPublicId: projectUploadResult.publicId,
      cloudinaryUrl: projectUploadResult.url,
      fileType: FileType.PROJECT,
      fileSize: projectUploadResult.fileSize,
      originalName: projectFile.originalname,
    });

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

