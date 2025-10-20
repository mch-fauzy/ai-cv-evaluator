import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { EvaluationJob } from '../entities/evaluation-job.entity';

@Injectable()
export class EvaluationJobRepository {
  constructor(
    @InjectRepository(EvaluationJob)
    private readonly evaluationJobRepo: Repository<EvaluationJob>,
  ) {}

  async create(
    data: Omit<EvaluationJob, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<EvaluationJob> {
    const job = this.evaluationJobRepo.create(data);
    return await this.evaluationJobRepo.save(job);
  }

  async findById(id: string): Promise<EvaluationJob | null> {
    return await this.evaluationJobRepo.findOne({
      where: { id },
      relations: ['cvFile', 'reportFile'],
    });
  }

  async findOrFailById(id: string): Promise<EvaluationJob> {
    const job = await this.evaluationJobRepo.findOne({
      where: { id },
      relations: ['cvFile', 'reportFile'],
    });
    if (!job) {
      throw new NotFoundException(`EvaluationJob with id ${id} not found`);
    }
    return job;
  }

  async findPendingJobs(): Promise<EvaluationJob[]> {
    return await this.evaluationJobRepo.find({
      where: { status: EvaluationStatus.PENDING },
      relations: ['cvFile', 'reportFile'],
      order: { createdAt: 'ASC' },
    });
  }

  async updateById(
    id: string,
    data: Partial<Pick<EvaluationJob, 'status'>>,
  ): Promise<void> {
    const job = await this.findOrFailById(id);
    await this.evaluationJobRepo.save(Object.assign(job, data));
  }
}
