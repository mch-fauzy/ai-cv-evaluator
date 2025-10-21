import { DataSource } from 'typeorm';
import { Paginated } from '../../../common/interfaces/api-response.interface';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import type { CreateEvaluationDto } from '../dto/request/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/response/evaluation-response.dto';
import { EvaluationListItemDto } from '../dto/response/evaluation-list-item.dto';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { EvaluationQueueService } from './evaluation-queue.service';
import type { EvaluationQueryDto } from '../dto/evaluation-query.dto';
export declare class EvaluationService {
    private readonly dataSource;
    private readonly evaluationRepository;
    private readonly uploadRepository;
    private readonly queueService;
    constructor(dataSource: DataSource, evaluationRepository: EvaluationRepository, uploadRepository: UploadRepository, queueService: EvaluationQueueService);
    createEvaluation(data: CreateEvaluationDto): Promise<EvaluationResponseDto>;
    getList(query: EvaluationQueryDto): Promise<Paginated<EvaluationListItemDto>>;
}
