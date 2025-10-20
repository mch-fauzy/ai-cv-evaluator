import { Test, TestingModule } from '@nestjs/testing';
import { ResultController } from './result.controller';
import { ResultService } from '../../services/result.service';

describe('ResultController', () => {
  let controller: ResultController;
  let service: ResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultController],
      providers: [ResultService],
    }).compile();

    controller = module.get<ResultController>(ResultController);
    service = module.get<ResultService>(ResultService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getResult', () => {
    it('should throw error - not yet implemented', async () => {
      const jobId = '770e8400-e29b-41d4-a716-446655440002';

      await expect(controller.getResult(jobId)).rejects.toThrow(
        'Result retrieval not yet implemented - Stage 5',
      );
    });
  });
});
