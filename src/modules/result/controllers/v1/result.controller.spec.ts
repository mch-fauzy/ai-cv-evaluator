import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { EvaluationRepository } from '../../../evaluation/repositories/evaluation.repository';
import { ResultRepository } from '../../repositories/result.repository';
import { ResultService } from '../../services/result.service';
import { ResultController } from './result.controller';

describe('ResultController', () => {
  let controller: ResultController;
  let service: ResultService;

  const mockEvaluationRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findOrFailById: jest.fn(),
    findPendingJobs: jest.fn(),
    updateById: jest.fn(),
  };

  const mockResultRepository = {
    create: jest.fn(),
    findByEvaluationId: jest.fn(),
    findOrFailByEvaluationId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultController],
      providers: [
        ResultService,
        {
          provide: EvaluationRepository,
          useValue: mockEvaluationRepository,
        },
        {
          provide: ResultRepository,
          useValue: mockResultRepository,
        },
      ],
    }).compile();

    controller = module.get<ResultController>(ResultController);
    service = module.get<ResultService>(ResultService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getResult', () => {
    const evaluationId = '770e8400-e29b-41d4-a716-446655440002';

    it('should return pending status with null result', async () => {
      mockEvaluationRepository.findById.mockResolvedValue({
        id: evaluationId,
        status: EvaluationStatus.PENDING,
      });

      const result = await controller.getResult(evaluationId);

      expect(result.message).toBe('Retrieved result data successfully');
      expect(result.data).not.toBeNull();
      expect(result.data?.id).toBe(evaluationId);
      expect(result.data?.status).toBe(EvaluationStatus.PENDING);
      expect(result.data?.result).toBeNull();
    });

    it('should return in_progress status with null result', async () => {
      mockEvaluationRepository.findById.mockResolvedValue({
        id: evaluationId,
        status: EvaluationStatus.IN_PROGRESS,
      });

      const result = await controller.getResult(evaluationId);

      expect(result.message).toBe('Retrieved result data successfully');
      expect(result.data).not.toBeNull();
      expect(result.data?.id).toBe(evaluationId);
      expect(result.data?.status).toBe(EvaluationStatus.IN_PROGRESS);
      expect(result.data?.result).toBeNull();
    });

    it('should return completed status with result data', async () => {
      mockEvaluationRepository.findById.mockResolvedValue({
        id: evaluationId,
        status: EvaluationStatus.COMPLETED,
      });

      mockResultRepository.findByEvaluationId.mockResolvedValue({
        id: 'result-id',
        evaluationId,
        cvMatchRate: 0.85,
        cvFeedback: 'Strong technical skills',
        projectScore: 4.5,
        projectFeedback: 'Excellent project implementation',
        overallSummary: 'Highly qualified candidate',
      });

      const result = await controller.getResult(evaluationId);

      expect(result.message).toBe('Retrieved result data successfully');
      expect(result.data).not.toBeNull();
      expect(result.data?.id).toBe(evaluationId);
      expect(result.data?.status).toBe(EvaluationStatus.COMPLETED);
      expect(result.data?.result).not.toBeNull();
      expect(result.data?.result?.cvMatchRate).toBe(0.85);
      expect(result.data?.result?.cvFeedback).toBe('Strong technical skills');
    });

    it('should return failed status with null result', async () => {
      mockEvaluationRepository.findById.mockResolvedValue({
        id: evaluationId,
        status: EvaluationStatus.FAILED,
      });

      const result = await controller.getResult(evaluationId);

      expect(result.message).toBe('Retrieved result data successfully');
      expect(result.data).not.toBeNull();
      expect(result.data?.id).toBe(evaluationId);
      expect(result.data?.status).toBe(EvaluationStatus.FAILED);
      expect(result.data?.result).toBeNull();
    });

    it('should throw NotFoundException when evaluation not found', async () => {
      mockEvaluationRepository.findById.mockResolvedValue(null);

      await expect(controller.getResult(evaluationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
