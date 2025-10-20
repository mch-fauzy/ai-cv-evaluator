import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from '../../services/evaluation.service';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';

describe('EvaluationController', () => {
  let controller: EvaluationController;
  let service: EvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationController],
      providers: [EvaluationService],
    }).compile();

    controller = module.get<EvaluationController>(EvaluationController);
    service = module.get<EvaluationService>(EvaluationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvaluation', () => {
    it('should throw error - not yet implemented', async () => {
      const dto: CreateEvaluationDto = {
        jobTitle: 'Senior Backend Developer',
        cvFileId: '550e8400-e29b-41d4-a716-446655440000',
        reportFileId: '660e8400-e29b-41d4-a716-446655440001',
      };

      await expect(controller.createEvaluation(dto)).rejects.toThrow(
        'Evaluation functionality not yet implemented - Stage 4',
      );
    });
  });
});
