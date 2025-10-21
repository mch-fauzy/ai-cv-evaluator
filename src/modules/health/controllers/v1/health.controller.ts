import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HealthCheckResponse } from '../../interfaces/health.interface';
import { HealthService } from '../../services/health.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../../../../common/constants/api-response-message.constant';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Retrieved health status data successfully',
        },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-20T08:37:04.039Z',
            },
            uptime: { type: 'number', example: 84.3391 },
          },
        },
      },
    },
  })
  getHealth(): ApiResult<HealthCheckResponse> {
    const data = this.healthService.getHealth();
    return {
      message: API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('health status'),
      data,
    };
  }
}
