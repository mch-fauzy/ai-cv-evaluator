import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultResponseDto } from '../../dto/response/result-response.dto';
import { ResultService } from '../../services/result.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@ApiTags('results')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get evaluation result by ID',
    description:
      'Retrieves the evaluation result. Returns status (pending/in_progress/completed/failed) and result details if completed.',
  })
  @ApiParam({
    name: 'id',
    description: 'Evaluation ID',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Evaluation result retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Evaluation not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async getResult(@Param('id') id: string): Promise<ApiResult<ResultResponseDto>> {
    const data = await this.resultService.getResult(id);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('result'),
      data,
    };
  }
}
