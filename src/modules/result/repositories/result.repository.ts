import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
