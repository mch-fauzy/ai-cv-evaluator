import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

import { Result } from '../entities/result.entity';

@Injectable()
export class ResultRepository {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepo: Repository<Result>,
  ) {}

  async create(
    data: Omit<Result, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Result> {
    const result = this.resultRepo.create(data);
    return await this.resultRepo.save(result);
  }

  async createResult(data: {
    evaluationId: string;
    cvMatchRate: number;
    cvFeedback: string;
    projectScore: number;
    projectFeedback: string;
    summary: string;
  }): Promise<Result> {
    const result = this.resultRepo.create({
      evaluationId: data.evaluationId,
      cvMatchRate: data.cvMatchRate,
      cvFeedback: data.cvFeedback,
      projectScore: data.projectScore,
      projectFeedback: data.projectFeedback,
      overallSummary: data.summary,
    });
    return await this.resultRepo.save(result);
  }

  async findByEvaluationId(evaluationId: string): Promise<Result | null> {
    return await this.resultRepo.findOne({
      where: { evaluationId },
      relations: ['evaluation'],
    });
  }

  async findOrFailByEvaluationId(evaluationId: string): Promise<Result> {
    const result = await this.resultRepo.findOne({
      where: { evaluationId },
      relations: ['evaluation'],
    });
    if (!result) {
      throw new NotFoundException(`Result for evaluation ${evaluationId} not found`);
    }
    return result;
  }

  /**
   * Create result within a transaction
   */
  async createResultWithTransaction(
    queryRunner: QueryRunner,
    data: {
      evaluationId: string;
      cvMatchRate: number;
      cvFeedback: string;
      projectScore: number;
      projectFeedback: string;
      summary: string;
    },
  ): Promise<Result> {
    const result = queryRunner.manager.create(Result, {
      evaluationId: data.evaluationId,
      cvMatchRate: data.cvMatchRate,
      cvFeedback: data.cvFeedback,
      projectScore: data.projectScore,
      projectFeedback: data.projectFeedback,
      overallSummary: data.summary,
    });
    return await queryRunner.manager.save(result);
  }
}
