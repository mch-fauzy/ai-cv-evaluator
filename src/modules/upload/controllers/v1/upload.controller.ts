import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { UploadResponseDto } from '../../dto/response/upload-response.dto';
import { UploadService } from '../../services/upload.service';
import type { ApiResult, Paginated } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';
import { UploadQueryDto } from '../../dto/upload-query.dto';
import type { UploadListItemDto } from '../../dto/response/upload-list-item.dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload CV and project files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['cv', 'project'],
      properties: {
        cv: {
          type: 'string',
          format: 'binary',
          description: 'CV file (PDF, max 10MB)',
        },
        project: {
          type: 'string',
          format: 'binary',
          description: 'Project file (PDF, max 10MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully uploaded files' },
        data: {
          type: 'object',
          properties: {
            cvFileId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            projectFileId: {
              type: 'string',
              format: 'uuid',
              example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid file type or size',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error - Upload failed',
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'project', maxCount: 1 },
    ]),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      project?: Express.Multer.File[];
    },
  ): Promise<ApiResult<UploadResponseDto>> {
    const data = await this.uploadService.uploadFiles(files);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_UPLOAD_DATA('files'),
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of uploads with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10, max: 100)',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved upload list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully retrieved uploads' },
        data: {
          type: 'object',
          properties: {
            metadata: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                perPage: { type: 'number', example: 10 },
                total: { type: 'number', example: 50 },
                totalPage: { type: 'number', example: 5 },
              },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  cloudinaryUrl: { type: 'string' },
                  fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                  originalName: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  async getList(
    @Query() query: UploadQueryDto,
  ): Promise<ApiResult<Paginated<UploadListItemDto>>> {
    const data = await this.uploadService.getList(query);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('uploads'),
      data,
    };
  }
}
