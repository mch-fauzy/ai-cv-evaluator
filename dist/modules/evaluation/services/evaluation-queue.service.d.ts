import type { Queue } from 'bull';
import type { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';
export declare class EvaluationQueueService {
    private readonly queue;
    constructor(queue: Queue);
    getQueue(): Queue;
    addJob(jobName: string, data: EvaluationJobData): Promise<string>;
    getJob(jobId: string): Promise<import("bull").Job<any> | null>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }>;
}
