import { Body, Controller, Post } from '@nestjs/common';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import type { EvaluationResponseDto } from '../../dto/response/evaluation-response.dto';
import { EvaluationService } from '../../services/evaluation.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
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
