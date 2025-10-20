import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ResultResponseCompletedDto,
  ResultResponseFailedDto,
  ResultResponsePendingDto,
} from '../dto/response/result-response.dto';

@Injectable()
export class ResultService {
  /**
   * Get evaluation result by job ID
   * Returns status and result if completed
   */
  async getResult(
    id: string,
  ): Promise<
    | ResultResponsePendingDto
    | ResultResponseCompletedDto
    | ResultResponseFailedDto
  > {
    // TODO: Implement in Stage 2 & 5
    // - Look up job by ID in database
    // - If not found, throw NotFoundException
    // - Return appropriate response based on job status
    // - If completed, include evaluation results

    throw new Error('Result retrieval not yet implemented - Stage 5');
  }
}
