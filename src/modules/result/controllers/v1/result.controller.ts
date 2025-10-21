import { Controller, Get, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultResponseDto } from '../../dto/response/result-response.dto';
import { ResultService } from '../../services/result.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@ApiTags('results')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':evaluationId')
  @ApiOperation({
    summary: 'Get evaluation result by evaluation ID',
    description:
      'Retrieves the evaluation result for a specific evaluation. Returns status (pending/in_progress/completed/failed) and result details if completed.',
  })
  @ApiParam({
    name: 'evaluationId',
    description: 'Evaluation ID (UUID format)',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Evaluation result retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully retrieved result',
        },
        data: {
          type: 'object',
          properties: {
            evaluationId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'failed'],
              example: 'completed',
            },
            result: {
              type: 'object',
              nullable: true,
              properties: {
                cvMatchRate: {
                  type: 'number',
                  format: 'float',
                  example: 0.85,
                  description: 'CV match rate (0-1)',
                },
                cvFeedback: {
                  type: 'string',
                  example: 'Strong technical background with 5+ years in backend development. Excellent experience with TypeScript and NestJS.',
                },
                projectScore: {
                  type: 'number',
                  format: 'float',
                  example: 4.2,
                  description: 'Project score (1-5)',
                },
                projectFeedback: {
                  type: 'string',
                  example: 'Excellent implementation with proper RAG pipeline. Clean TypeScript code following best practices.',
                },
                overallSummary: {
                  type: 'string',
                  example: 'Strong candidate with excellent technical skills and solid project delivery. Recommended for interview.',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Evaluation not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async getResult(
    @Param('evaluationId', ParseUUIDPipe) evaluationId: string,
  ): Promise<ApiResult<ResultResponseDto>> {
    const data = await this.resultService.getResult(evaluationId);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('result'),
      data,
    };
  }
}
