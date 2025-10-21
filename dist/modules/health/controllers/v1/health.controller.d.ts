import type { HealthCheckResponse } from '../../interfaces/health.interface';
import { HealthService } from '../../services/health.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): ApiResult<HealthCheckResponse>;
}
