/**
 * Queue names for different job types
 */
export const QUEUE_NAMES = {
  evaluation: 'evaluation',
} as const;

/**
 * Job names for evaluation queue
 */
export const JOB_NAMES = {
  processEvaluation: 'process-evaluation',
} as const;

/**
 * Queue configuration options
 */
export const QUEUE_OPTIONS = {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Keep completed jobs for 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
} as const;
