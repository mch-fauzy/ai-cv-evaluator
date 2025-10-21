import { Repository, QueryRunner } from 'typeorm';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { Evaluation } from '../entities/evaluation.entity';
export declare class EvaluationRepository {
    private readonly evaluationRepo;
    constructor(evaluationRepo: Repository<Evaluation>);
    create(data: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Evaluation>;
    createWithTransaction(queryRunner: QueryRunner, data: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Evaluation>;
    findById(id: string): Promise<Evaluation | null>;
    findOrFailById(id: string): Promise<Evaluation>;
    findPendingJobs(): Promise<Evaluation[]>;
    updateStatus(id: string, status: EvaluationStatus): Promise<void>;
    updateById(id: string, data: Partial<Pick<Evaluation, 'status'>>): Promise<void>;
    updateStatusWithTransaction(queryRunner: QueryRunner, id: string, status: EvaluationStatus): Promise<void>;
    getList(page: number, limit: number): Promise<{
        evaluations: Evaluation[];
        totalEvaluations: number;
    }>;
}
