import { EvaluationRepository } from '../../evaluation/repositories/evaluation.repository';
import { ResultResponseDto } from '../dto/response/result-response.dto';
import { ResultRepository } from '../repositories/result.repository';
export declare class ResultService {
    private readonly evaluationRepository;
    private readonly resultRepository;
    constructor(evaluationRepository: EvaluationRepository, resultRepository: ResultRepository);
    getResult(id: string): Promise<ResultResponseDto>;
}
