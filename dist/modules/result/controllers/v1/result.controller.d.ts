import { ResultResponseDto } from '../../dto/response/result-response.dto';
import { ResultService } from '../../services/result.service';
import type { ApiResult } from '../../../../common/interfaces/api-response.interface';
export declare class ResultController {
    private readonly resultService;
    constructor(resultService: ResultService);
    getResult(evaluationId: string): Promise<ApiResult<ResultResponseDto>>;
}
