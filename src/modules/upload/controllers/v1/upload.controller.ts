import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { UploadResponseDto } from '../../dto/response/upload-response.dto';
import { UploadService } from '../../services/upload.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'report', maxCount: 1 },
    ]),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      report?: Express.Multer.File[];
    },
  ): Promise<ApiResult<UploadResponseDto>> {
    const data = await this.uploadService.uploadFiles(files);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_UPLOAD_DATA('files'),
      data,
    };
  }
}
