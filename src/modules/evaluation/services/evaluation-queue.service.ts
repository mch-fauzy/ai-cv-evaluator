import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

import { QUEUE_NAMES } from '../../../common/constants/queue.constant';
import type { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';

/**
 * Evaluation queue service for managing evaluation jobs
 * Handles job enqueueing and queue statistics
 */
@Injectable()
export class EvaluationQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.EVALUATION)
    private readonly queue: Queue,
  ) {}

  /**
   * Get evaluation queue
   */
  getQueue(): Queue {
    return this.queue;
  }

  /**
   * Add job to evaluation queue
   */
  async addJob(jobName: string, data: EvaluationJobData): Promise<string> {
    const job = await this.queue.add(jobName, data);
    return job.id.toString();
  }

  /**
   * Get job by ID from evaluation queue
   */
  async getJob(jobId: string) {
    return await this.queue.getJob(jobId);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }
}
