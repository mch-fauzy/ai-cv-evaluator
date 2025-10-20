import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResponse } from '../../interfaces/health.interface';
import { HealthService } from '../../services/health.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): ApiResult<HealthCheckResponse> {
    const data = this.healthService.getHealth();
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('health status'),
      data,
    };
  }
}
