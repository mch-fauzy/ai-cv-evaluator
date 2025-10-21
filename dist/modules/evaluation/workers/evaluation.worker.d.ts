import type { Job } from 'bull';
import { DataSource } from 'typeorm';
import { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ResultRepository } from '../../result/repositories/result.repository';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { OpenAIService } from '../../externals/openai/services/openai.service';
import { ChromaDBService } from '../../externals/chromadb/services/chromadb.service';
export declare class EvaluationWorker {
    private readonly dataSource;
    private readonly evaluationRepository;
    private readonly resultRepository;
    private readonly uploadRepository;
    private readonly openaiService;
    private readonly chromadbService;
    private readonly logger;
    constructor(dataSource: DataSource, evaluationRepository: EvaluationRepository, resultRepository: ResultRepository, uploadRepository: UploadRepository, openaiService: OpenAIService, chromadbService: ChromaDBService);
    processEvaluation(job: Job<EvaluationJobData>): Promise<void>;
    private downloadAndExtractPDF;
}
