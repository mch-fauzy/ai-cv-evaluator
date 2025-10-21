import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';

import { EvaluationQueueService } from './evaluation-queue.service';
import { QUEUE_NAMES } from '../../../common/constants/queue.constant';

describe('EvaluationQueueService', () => {
  let service: EvaluationQueueService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: '123' }),
      getJob: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(5),
      getActiveCount: jest.fn().mockResolvedValue(2),
      getCompletedCount: jest.fn().mockResolvedValue(10),
      getFailedCount: jest.fn().mockResolvedValue(1),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationQueueService,
        {
          provide: getQueueToken(QUEUE_NAMES.evaluation),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<EvaluationQueueService>(EvaluationQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get queue', () => {
    const queue = service.getQueue();
    expect(queue).toBeDefined();
    expect(queue).toBe(mockQueue);
  });

  it('should add job to queue', async () => {
    const jobName = 'process-evaluation';
    const jobData = {
      evaluationId: 'eval-123',
      jobTitle: 'Software Engineer',
      cvFileId: 'cv-file-123',
      projectFileId: 'project-file-123',
    };

    const jobId = await service.addJob(jobName, jobData);

    expect(mockQueue.add).toHaveBeenCalledWith(jobName, jobData);
    expect(jobId).toBe('123');
  });

  it('should get job by ID', async () => {
    const jobId = '123';
    await service.getJob(jobId);

    expect(mockQueue.getJob).toHaveBeenCalledWith(jobId);
  });

  it('should get queue statistics', async () => {
    const stats = await service.getQueueStats();

    expect(stats).toEqual({
      waiting: 5,
      active: 2,
      completed: 10,
      failed: 1,
      delayed: 0,
    });
    expect(mockQueue.getWaitingCount).toHaveBeenCalled();
    expect(mockQueue.getActiveCount).toHaveBeenCalled();
    expect(mockQueue.getCompletedCount).toHaveBeenCalled();
    expect(mockQueue.getFailedCount).toHaveBeenCalled();
    expect(mockQueue.getDelayedCount).toHaveBeenCalled();
  });
});
