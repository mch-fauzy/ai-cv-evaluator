import type { ApiResult, Paginated } from '../../../../common/interfaces/api-response.interface';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import type { EvaluationResponseDto } from '../../dto/response/evaluation-response.dto';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationQueryDto } from '../../dto/evaluation-query.dto';
import type { EvaluationListItemDto } from '../../dto/response/evaluation-list-item.dto';
export declare class EvaluationController {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    createEvaluation(data: CreateEvaluationDto): Promise<ApiResult<EvaluationResponseDto>>;
    getList(query: EvaluationQueryDto): Promise<ApiResult<Paginated<EvaluationListItemDto>>>;
}
