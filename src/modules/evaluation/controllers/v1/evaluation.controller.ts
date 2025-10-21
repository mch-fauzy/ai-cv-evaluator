import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { ApiResult, Paginated } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import type { EvaluationResponseDto } from '../../dto/response/evaluation-response.dto';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationQueryDto } from '../../dto/evaluation-query.dto';
import type { EvaluationListItemDto } from '../../dto/response/evaluation-list-item.dto';

@ApiTags('evaluation')
@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create evaluation job' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Evaluation job created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully created evaluation job',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'failed'],
              example: 'pending',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid data or files not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async createEvaluation(
    @Body() data: CreateEvaluationDto,
  ): Promise<ApiResult<EvaluationResponseDto>> {
    const response = await this.evaluationService.createEvaluation(data);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_CREATE_DATA('evaluation job'),
      data: response,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of evaluations with pagination' })
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
    description: 'Successfully retrieved evaluation list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully retrieved evaluations' },
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
                  jobTitle: { type: 'string' },
                  cvFile: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      cloudinaryUrl: { type: 'string' },
                      fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                      originalName: { type: 'string' },
                    },
                  },
                  projectFile: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      cloudinaryUrl: { type: 'string' },
                      fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                      originalName: { type: 'string' },
                    },
                  },
                  status: {
                    type: 'string',
                    enum: ['pending', 'in_progress', 'completed', 'failed'],
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getList(
    @Query() query: EvaluationQueryDto,
  ): Promise<ApiResult<Paginated<EvaluationListItemDto>>> {
    const data = await this.evaluationService.getList(query);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('evaluations'),
      data,
    };
  }
}
