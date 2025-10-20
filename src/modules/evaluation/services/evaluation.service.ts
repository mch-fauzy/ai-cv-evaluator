import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateEvaluation } from '../dto/request/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/response/evaluation-response.dto';

@Injectable()
export class EvaluationService {
  /**
   * Create a new evaluation job
   * Validates files exist and creates a queued job
   */
  async createEvaluation(
    data: CreateEvaluation,
  ): Promise<EvaluationResponseDto> {
    // TODO: Implement in Stage 2 & 4
    // - Validate CV and report files exist in database
    // - Create job record with status 'queued'
    // - Return job ID and status

    throw new Error('Evaluation functionality not yet implemented - Stage 4');
  }
}
