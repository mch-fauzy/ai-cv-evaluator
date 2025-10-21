import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import type { EvaluationResponseDto } from '../../dto/response/evaluation-response.dto';
import { EvaluationService } from '../../services/evaluation.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@ApiTags('evaluation')
@Controller('evaluate')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @ApiOperation({ summary: 'Create evaluation job (Not yet implemented - Stage 4)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Evaluation job created' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Not yet implemented' })
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
