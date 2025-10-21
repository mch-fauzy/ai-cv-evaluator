import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

import { QUEUE_NAMES, QUEUE_OPTIONS } from '../../../common/constants/queue.constant';
import { redisConfig } from '../../../config';

/**
 * Queue service for managing BullMQ queues
 * Provides centralized queue management and job enqueueing
 */
@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly connection: Redis;
  private readonly queues: Map<string, Queue> = new Map();

  constructor() {
    // Create Redis connection for BullMQ using connection string
    this.connection = new Redis(redisConfig.URL, {
      maxRetriesPerRequest: null, // Required for BullMQ
    });
  }

  async onModuleInit(): Promise<void> {
    // Initialize evaluation queue
    const evaluationQueue = new Queue(QUEUE_NAMES.EVALUATION, {
      connection: this.connection,
      defaultJobOptions: QUEUE_OPTIONS.defaultJobOptions,
    });

    this.queues.set(QUEUE_NAMES.EVALUATION, evaluationQueue);
  }

  async onModuleDestroy(): Promise<void> {
    // Close all queues
    await Promise.all(
      Array.from(this.queues.values()).map((queue) => queue.close()),
    );

    // Close Redis connection
    await this.connection.quit();
  }

  /**
   * Get queue by name
   */
  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName);
  }

  /**
   * Get evaluation queue
   */
  getEvaluationQueue(): Queue {
    const queue = this.queues.get(QUEUE_NAMES.EVALUATION);
    if (!queue) {
      throw new Error('Evaluation queue not initialized');
    }
    return queue;
  }

  /**
   * Add job to evaluation queue
   */
  async addEvaluationJob(
    jobName: string,
    data: Record<string, unknown>,
  ): Promise<string> {
    const queue = this.getEvaluationQueue();
    const job = await queue.add(jobName, data);
    return job.id ?? '';
  }

  /**
   * Get job by ID from evaluation queue
   */
  async getEvaluationJob(jobId: string) {
    const queue = this.getEvaluationQueue();
    return await queue.getJob(jobId);
  }

  /**
   * Get queue stats
   */
  async getQueueStats(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
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
