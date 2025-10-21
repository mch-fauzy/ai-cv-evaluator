import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ResultResponseCompletedDto,
  ResultResponseFailedDto,
  ResultResponsePendingDto,
} from '../../dto/response/result-response.dto';
import { ResultService } from '../../services/result.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@ApiTags('results')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation result (Not yet implemented - Stage 5)' })
  @ApiParam({ name: 'id', description: 'Evaluation job ID', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Evaluation result retrieved' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Evaluation not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Not yet implemented' })
  async getResult(
    @Param('id') id: string,
  ): Promise<
    ApiResult<
      | ResultResponsePendingDto
      | ResultResponseCompletedDto
      | ResultResponseFailedDto
    >
  > {
    const data = await this.resultService.getResult(id);
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('evaluation result'),
      data,
    };
  }
}
