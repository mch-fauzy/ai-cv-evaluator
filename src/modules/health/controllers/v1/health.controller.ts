import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResponse } from '../../interfaces/health.interface';
import { HealthService } from '../../services/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthCheckResponse {
    return this.healthService.getHealth();
  }
}
