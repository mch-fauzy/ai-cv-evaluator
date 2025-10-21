import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import type { EvaluationResponseDto } from '../../dto/response/evaluation-response.dto';
import { EvaluationService } from '../../services/evaluation.service';

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
}
