import { Repository, QueryRunner } from 'typeorm';
import { Result } from '../entities/result.entity';
export declare class ResultRepository {
    private readonly resultRepo;
    constructor(resultRepo: Repository<Result>);
    create(data: Omit<Result, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Result>;
    createResult(data: {
        evaluationId: string;
        cvMatchRate: number;
        cvFeedback: string;
        projectScore: number;
        projectFeedback: string;
        summary: string;
    }): Promise<Result>;
    findByEvaluationId(evaluationId: string): Promise<Result | null>;
    findOrFailByEvaluationId(evaluationId: string): Promise<Result>;
    createResultWithTransaction(queryRunner: QueryRunner, data: {
        evaluationId: string;
        cvMatchRate: number;
        cvFeedback: string;
        projectScore: number;
        projectFeedback: string;
        summary: string;
    }): Promise<Result>;
}
