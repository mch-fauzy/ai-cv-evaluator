import { Injectable, NotFoundException } from '@nestjs/common';

import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { EvaluationRepository } from '../../evaluation/repositories/evaluation.repository';
import { EvaluationResultDto } from '../dto/response/evaluation-result.dto';
import { ResultResponseDto } from '../dto/response/result-response.dto';
import { ResultRepository } from '../repositories/result.repository';

@Injectable()
export class ResultService {
  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly resultRepository: ResultRepository,
  ) {}

  /**
   * Get evaluation result by evaluation ID
   * Returns status and result if completed
   */
  async getResult(id: string): Promise<ResultResponseDto> {
    // Find the evaluation by ID
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with id ${id} not found`);
    }

    // Return response based on status
    switch (evaluation.status) {
      case EvaluationStatus.PENDING:
        return ResultResponseDto.fromPending(evaluation.id, EvaluationStatus.PENDING);

      case EvaluationStatus.IN_PROGRESS:
        return ResultResponseDto.fromPending(
          evaluation.id,
          EvaluationStatus.IN_PROGRESS,
        );

      case EvaluationStatus.COMPLETED: {
        // Find the result
        const result = await this.resultRepository.findByEvaluationId(evaluation.id);
        if (!result) {
          throw new NotFoundException(
            `Result for evaluation ${id} not found despite completed status`,
          );
        }

        // Map to DTO
        const resultDto = EvaluationResultDto.from(
          result.cvMatchRate,
          result.cvFeedback,
          result.projectScore,
          result.projectFeedback,
          result.overallSummary,
        );

        return ResultResponseDto.fromCompleted(evaluation.id, resultDto);
      }

      case EvaluationStatus.FAILED:
        // TODO: In future, we could store error messages in the evaluation table
        return ResultResponseDto.fromFailed(evaluation.id);

      default:
        throw new Error(`Unknown evaluation status: ${evaluation.status}`);
    }
  }
}
