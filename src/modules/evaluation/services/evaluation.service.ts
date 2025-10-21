import { Injectable, NotFoundException } from '@nestjs/common';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { JOB_NAMES } from '../../../common/constants/queue.constant';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import type { CreateEvaluation } from '../dto/request/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/response/evaluation-response.dto';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { EvaluationQueueService } from './evaluation-queue.service';
import type { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly queueService: EvaluationQueueService,
  ) {}

  /**
   * Create a new evaluation job
   * Validates files exist and creates a pending job
   */
  async createEvaluation(
    data: CreateEvaluation,
  ): Promise<EvaluationResponseDto> {
    // Validate that both files exist in the database
    const files = await this.uploadRepository.findByIds([
      data.cvFileId,
      data.projectFileId,
    ]);

    if (files.length !== 2) {
      const missingIds = [data.cvFileId, data.projectFileId].filter(
        (id) => !files.find((f) => f.id === id),
      );
      throw new NotFoundException(
        `Files not found: ${missingIds.join(', ')}`,
      );
    }

    // Create evaluation job with PENDING status
    const evaluation = await this.evaluationRepository.create({
      jobTitle: data.jobTitle,
      cvFileId: data.cvFileId,
      projectFileId: data.projectFileId,
      status: EvaluationStatus.PENDING,
    });

    // Enqueue the evaluation job for async processing
    const jobData: EvaluationJobData = {
      evaluationId: evaluation.id,
      jobTitle: evaluation.jobTitle,
      cvFileId: evaluation.cvFileId,
      projectFileId: evaluation.projectFileId,
    };

    await this.queueService.addJob(JOB_NAMES.PROCESS_EVALUATION, jobData);

    return EvaluationResponseDto.from(evaluation.id, evaluation.status);
  }
}
