import { Controller, Get, Param } from '@nestjs/common';
import {
  ResultResponseCompletedDto,
  ResultResponseFailedDto,
  ResultResponsePendingDto,
} from '../../dto/response/result-response.dto';
import { ResultService } from '../../services/result.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
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
