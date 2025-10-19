import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from '../interfaces/health.interface';

@Injectable()
export class HealthService {
  /**
   * Returns health check information
   */
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
