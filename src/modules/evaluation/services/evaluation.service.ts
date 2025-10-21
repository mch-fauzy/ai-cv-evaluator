import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { JOB_NAMES } from '../../../common/constants/queue.constant';
import { Paginated } from '../../../common/interfaces/api-response.interface';
import { PaginationUtil } from '../../../common/utils/pagination.util';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { TransactionUtil } from '../../../common/utils/transaction.util';
import type { CreateEvaluationDto } from '../dto/request/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/response/evaluation-response.dto';
import { EvaluationListItemDto } from '../dto/response/evaluation-list-item.dto';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { EvaluationQueueService } from './evaluation-queue.service';
import type { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';
import type { EvaluationQueryDto } from '../dto/evaluation-query.dto';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly queueService: EvaluationQueueService,
  ) {}

  /**
   * Create a new evaluation job
   * Validates files exist and creates a pending job
   */
  async createEvaluation(
    data: CreateEvaluationDto,
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

    // Create evaluation and enqueue job in a transaction
    const evaluation = await TransactionUtil.execute(
      this.dataSource,
      async (queryRunner) => {
        // Create evaluation job with PENDING status
        const newEvaluation = await this.evaluationRepository.createWithTransaction(
          queryRunner,
          {
            jobTitle: data.jobTitle,
            cvFileId: data.cvFileId,
            projectFileId: data.projectFileId,
            status: EvaluationStatus.PENDING,
          },
        );

        // Enqueue the evaluation job for async processing
        const jobData: EvaluationJobData = {
          evaluationId: newEvaluation.id,
          jobTitle: newEvaluation.jobTitle,
          cvFileId: newEvaluation.cvFileId,
          projectFileId: newEvaluation.projectFileId,
        };

        await this.queueService.addJob(JOB_NAMES.processEvaluation, jobData);

        return newEvaluation;
      },
    );

    return EvaluationResponseDto.from(evaluation.id, evaluation.status);
  }

  /**
   * Get paginated list of evaluations with file relations
   * Returns evaluation records including CV and project file details
   */
  async getList(query: EvaluationQueryDto): Promise<Paginated<EvaluationListItemDto>> {
    const { evaluations, totalEvaluations } =
      await this.evaluationRepository.getList(query.page, query.limit);

    return {
      metadata: PaginationUtil.mapMetadata({
        count: totalEvaluations,
        page: query.page,
        perPage: query.limit,
      }),
      items: EvaluationListItemDto.fromList(evaluations),
    };
  }
}
