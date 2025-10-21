import { Test, TestingModule } from '@nestjs/testing';

import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  afterEach(async () => {
    // Clean up: close connections
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize evaluation queue on module init', async () => {
    await service.onModuleInit();

    const evaluationQueue = service.getEvaluationQueue();
    expect(evaluationQueue).toBeDefined();
    expect(evaluationQueue.name).toBe('evaluation');
  });

  it('should get queue by name', async () => {
    await service.onModuleInit();

    const queue = service.getQueue('evaluation');
    expect(queue).toBeDefined();
    expect(queue?.name).toBe('evaluation');
  });

  it('should return undefined for non-existent queue', async () => {
    await service.onModuleInit();

    const queue = service.getQueue('non-existent');
    expect(queue).toBeUndefined();
  });

  it('should throw error when getting evaluation queue before initialization', () => {
    expect(() => service.getEvaluationQueue()).toThrow(
      'Evaluation queue not initialized',
    );
  });
});
