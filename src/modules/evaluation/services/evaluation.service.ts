import { Injectable, BadRequestException } from '@nestjs/common';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import type { CreateEvaluation } from '../dto/request/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/response/evaluation-response.dto';
import { EvaluationRepository } from '../repositories/evaluation.repository';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly uploadRepository: UploadRepository,
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
      throw new BadRequestException(
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

    return EvaluationResponseDto.from(evaluation.id, evaluation.status);
  }
}
