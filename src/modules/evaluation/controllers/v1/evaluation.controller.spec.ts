import { Test, TestingModule } from '@nestjs/testing';

import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { UploadRepository } from '../../../upload/repositories/upload.repository';
import { CreateEvaluationDto } from '../../dto/request/create-evaluation.dto';
import { EvaluationRepository } from '../../repositories/evaluation.repository';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationController } from './evaluation.controller';

describe('EvaluationController', () => {
  let controller: EvaluationController;
  let service: EvaluationService;

  const mockEvaluationRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findOrFailById: jest.fn(),
    findPendingJobs: jest.fn(),
    updateById: jest.fn(),
  };

  const mockUploadRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findOrFailById: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationController],
      providers: [
        EvaluationService,
        {
          provide: EvaluationRepository,
          useValue: mockEvaluationRepository,
        },
        {
          provide: UploadRepository,
          useValue: mockUploadRepository,
        },
      ],
    }).compile();

    controller = module.get<EvaluationController>(EvaluationController);
    service = module.get<EvaluationService>(EvaluationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvaluation', () => {
    it('should create evaluation job successfully', async () => {
      const dto: CreateEvaluationDto = {
        jobTitle: 'Senior Backend Developer',
        cvFileId: '550e8400-e29b-41d4-a716-446655440000',
        projectFileId: '660e8400-e29b-41d4-a716-446655440001',
      };

      const mockEvaluationId = '770e8400-e29b-41d4-a716-446655440002';

      // Mock files exist
      mockUploadRepository.findByIds.mockResolvedValue([
        { id: dto.cvFileId },
        { id: dto.projectFileId },
      ]);

      // Mock evaluation creation
      mockEvaluationRepository.create.mockResolvedValue({
        id: mockEvaluationId,
        jobTitle: dto.jobTitle,
        cvFileId: dto.cvFileId,
        projectFileId: dto.projectFileId,
        status: EvaluationStatus.PENDING,
      });

      const result = await controller.createEvaluation(dto);

      expect(result).toEqual({
        message: 'Created evaluation job successfully',
        data: {
          id: mockEvaluationId,
          status: EvaluationStatus.PENDING,
        },
      });

      expect(mockUploadRepository.findByIds).toHaveBeenCalledWith([
        dto.cvFileId,
        dto.projectFileId,
      ]);
      expect(mockEvaluationRepository.create).toHaveBeenCalledWith({
        jobTitle: dto.jobTitle,
        cvFileId: dto.cvFileId,
        projectFileId: dto.projectFileId,
        status: EvaluationStatus.PENDING,
      });
    });
  });
});
