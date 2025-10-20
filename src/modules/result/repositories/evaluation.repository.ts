import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Evaluation } from '../entities/evaluation.entity';

@Injectable()
export class EvaluationRepository {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepo: Repository<Evaluation>,
  ) {}

  async create(
    data: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Evaluation> {
    const evaluation = this.evaluationRepo.create(data);
    return await this.evaluationRepo.save(evaluation);
  }

  async findByJobId(jobId: string): Promise<Evaluation | null> {
    return await this.evaluationRepo.findOne({
      where: { jobId },
      relations: ['job'],
    });
  }

  async findOrFailByJobId(jobId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.findOne({
      where: { jobId },
      relations: ['job'],
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation for job ${jobId} not found`);
    }
    return evaluation;
  }
}
