import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
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

  async findById(id: string): Promise<Evaluation | null> {
    return await this.evaluationRepo.findOne({
      where: { id },
      relations: ['cvFile', 'projectFile'],
    });
  }

  async findOrFailById(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.findOne({
      where: { id },
      relations: ['cvFile', 'projectFile'],
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with id ${id} not found`);
    }
    return evaluation;
  }

  async findPendingJobs(): Promise<Evaluation[]> {
    return await this.evaluationRepo.find({
      where: { status: EvaluationStatus.PENDING },
      relations: ['cvFile', 'projectFile'],
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(
    id: string,
    status: EvaluationStatus,
  ): Promise<void> {
    await this.evaluationRepo.update(id, { status });
  }

  async markFailed(id: string, errorMessage: string): Promise<void> {
    await this.evaluationRepo.update(id, {
      status: EvaluationStatus.FAILED,
      // TODO: Add error message
    });
  }

  async updateById(
    id: string,
    data: Partial<Pick<Evaluation, 'status'>>,
  ): Promise<void> {
    const evaluation = await this.findOrFailById(id);
    await this.evaluationRepo.save(Object.assign(evaluation, data));
  }
}
