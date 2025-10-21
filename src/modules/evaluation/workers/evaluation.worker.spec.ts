import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import axios from 'axios';
import { PDFParse } from 'pdf-parse';

import { EvaluationWorker } from './evaluation.worker';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ResultRepository } from '../../result/repositories/result.repository';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { OpenAIService } from '../../../externals/openai/openai.service';
import { ChromaDBService } from '../../../externals/chromadb/chromadb.service';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';

// Mock external modules
jest.mock('axios');
jest.mock('pdf-parse');

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('EvaluationWorker', () => {
  let worker: EvaluationWorker;
  let dataSource: jest.Mocked<DataSource>;
  let evaluationRepository: jest.Mocked<EvaluationRepository>;
  let resultRepository: jest.Mocked<ResultRepository>;
  let uploadRepository: jest.Mocked<UploadRepository>;
  let openaiService: jest.Mocked<OpenAIService>;
  let chromadbService: jest.Mocked<ChromaDBService>;

  // Helper to create valid PDFParse TextResult
  const createMockTextResult = (text: string) => ({
    text,
    pages: [],
    total: 1,
    getPageText: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationWorker,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                create: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
              },
            }),
          },
        },
        {
          provide: EvaluationRepository,
          useValue: {
            findById: jest.fn(),
            updateStatus: jest.fn(),
            updateStatusWithTransaction: jest.fn(),
            markFailed: jest.fn(),
          },
        },
        {
          provide: ResultRepository,
          useValue: {
            createResult: jest.fn(),
            createResultWithTransaction: jest.fn(),
          },
        },
        {
          provide: UploadRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: OpenAIService,
          useValue: {
            evaluateCV: jest.fn(),
            scoreProject: jest.fn(),
            generateSummary: jest.fn(),
          },
        },
        {
          provide: ChromaDBService,
          useValue: {
            searchEvaluationContext: jest.fn(),
          },
        },
      ],
    }).compile();

    worker = module.get<EvaluationWorker>(EvaluationWorker);
    dataSource = module.get(DataSource);
    evaluationRepository = module.get(EvaluationRepository);
    resultRepository = module.get(ResultRepository);
    uploadRepository = module.get(UploadRepository);
    openaiService = module.get(OpenAIService);
    chromadbService = module.get(ChromaDBService);

    // Silence logger during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Service Structure', () => {
    it('should be defined', () => {
      expect(worker).toBeDefined();
    });

    it('should have processEvaluation method', () => {
      expect(worker.processEvaluation).toBeDefined();
      expect(typeof worker.processEvaluation).toBe('function');
    });
  });

  describe('Dependencies', () => {
    it('should inject DataSource', () => {
      expect(dataSource).toBeDefined();
    });

    it('should inject EvaluationRepository', () => {
      expect(evaluationRepository).toBeDefined();
    });

    it('should inject ResultRepository', () => {
      expect(resultRepository).toBeDefined();
    });

    it('should inject UploadRepository', () => {
      expect(uploadRepository).toBeDefined();
    });

    it('should inject OpenAIService', () => {
      expect(openaiService).toBeDefined();
    });

    it('should inject ChromaDBService', () => {
      expect(chromadbService).toBeDefined();
    });
  });

  describe('processEvaluation - Success Path', () => {
    it('should successfully process evaluation with full workflow', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      const mockEvaluation = {
        id: 'eval-123',
        status: 'PENDING',
        jobTitle: 'Senior Backend Developer',
      };

      const mockCvFile = {
        id: 'cv-456',
        cloudinaryUrl: 'https://cloudinary.com/cv.pdf',
      };

      const mockProjectFile = {
        id: 'project-789',
        cloudinaryUrl: 'https://cloudinary.com/project.pdf',
      };

      // Mock all repository calls
      evaluationRepository.findById.mockResolvedValue(mockEvaluation as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById
        .mockResolvedValueOnce(mockCvFile as any)
        .mockResolvedValueOnce(mockProjectFile as any);

      // Mock axios for PDF downloads
      mockAxios.get = jest.fn()
        .mockResolvedValueOnce({ data: Buffer.from('CV PDF content') })
        .mockResolvedValueOnce({ data: Buffer.from('Project PDF content') });

      // Mock pdf-parse
      jest.spyOn(PDFParse.prototype, 'getText')
        .mockResolvedValueOnce(createMockTextResult('CV text content'))
        .mockResolvedValueOnce(createMockTextResult('Project text content'));

      // Mock ChromaDB
      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: 'Job requirements...',
        caseStudyContext: 'Case study details...',
      });

      // Mock OpenAI
      openaiService.evaluateCV.mockResolvedValue({
        matchRate: 0.85,
        feedback: 'Strong technical skills',
      });
      openaiService.scoreProject.mockResolvedValue({
        score: 4.2,
        feedback: 'Excellent implementation',
      });
      openaiService.generateSummary.mockResolvedValue(
        'Overall excellent candidate',
      );

      // Mock transaction
      const mockQueryRunner = dataSource.createQueryRunner();
      resultRepository.createResultWithTransaction.mockResolvedValue({} as any);
      evaluationRepository.updateStatusWithTransaction.mockResolvedValue(undefined);

      // Act
      await worker.processEvaluation({ data: jobData } as any);

      // Assert
      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.IN_PROGRESS,
      );
      expect(uploadRepository.findById).toHaveBeenCalledWith('cv-456');
      expect(uploadRepository.findById).toHaveBeenCalledWith('project-789');
      expect(chromadbService.searchEvaluationContext).toHaveBeenCalledWith({
        jobTitle: 'Senior Backend Developer',
      });
      expect(openaiService.evaluateCV).toHaveBeenCalled();
      expect(openaiService.scoreProject).toHaveBeenCalled();
      expect(openaiService.generateSummary).toHaveBeenCalled();
      expect(resultRepository.createResultWithTransaction).toHaveBeenCalled();
      expect(evaluationRepository.updateStatusWithTransaction).toHaveBeenCalledWith(
        expect.anything(),
        'eval-123',
        EvaluationStatus.COMPLETED,
      );
    });
  });

  describe('processEvaluation - Error Scenarios', () => {
    it('should handle CV file not found', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-not-found',
        projectFileId: 'project-789',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue(null); // File not found

      // Mock ChromaDB (will be called in Promise.all)
      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('Failed to process CV');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.IN_PROGRESS,
      );
      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should handle project file not found', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-not-found',
      };

      const mockCvFile = {
        id: 'cv-456',
        cloudinaryUrl: 'https://cloudinary.com/cv.pdf',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById
        .mockResolvedValueOnce(mockCvFile as any)
        .mockResolvedValueOnce(null); // Project file not found

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('CV content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockResolvedValue(createMockTextResult('CV text'));

      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('Failed to process Project');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should handle PDF download failure', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      const mockCvFile = {
        id: 'cv-456',
        cloudinaryUrl: 'https://cloudinary.com/cv.pdf',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue(mockCvFile as any);

      mockAxios.get = jest.fn().mockRejectedValue(new Error('Network error'));

      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('Failed to process CV');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should handle PDF parsing error', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      const mockCvFile = {
        id: 'cv-456',
        cloudinaryUrl: 'https://cloudinary.com/cv.pdf',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue(mockCvFile as any);

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('PDF content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockRejectedValue(
        new Error('Invalid PDF format'),
      );

      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('Failed to process CV');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should continue when ChromaDB fails (graceful degradation)', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue({
        cloudinaryUrl: 'https://cloudinary.com/file.pdf',
      } as any);

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('PDF content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockResolvedValue(createMockTextResult('Text content'));

      // ChromaDB fails
      chromadbService.searchEvaluationContext.mockRejectedValue(
        new Error('ChromaDB connection failed'),
      );

      openaiService.evaluateCV.mockResolvedValue({
        matchRate: 0.75,
        feedback: 'Good candidate',
      });
      openaiService.scoreProject.mockResolvedValue({
        score: 4.0,
        feedback: 'Solid work',
      });
      openaiService.generateSummary.mockResolvedValue('Summary');

      const mockQueryRunner = dataSource.createQueryRunner();
      resultRepository.createResultWithTransaction.mockResolvedValue({} as any);
      evaluationRepository.updateStatusWithTransaction.mockResolvedValue(undefined);

      // Act
      await worker.processEvaluation({ data: jobData } as any);

      // Assert - should complete despite ChromaDB failure
      expect(openaiService.evaluateCV).toHaveBeenCalledWith(
        expect.objectContaining({
          jobContext: '', // Empty because ChromaDB failed
        }),
      );
      expect(evaluationRepository.updateStatusWithTransaction).toHaveBeenCalledWith(
        expect.anything(),
        'eval-123',
        EvaluationStatus.COMPLETED,
      );
    });

    it('should handle OpenAI evaluation failure', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue({
        cloudinaryUrl: 'https://cloudinary.com/file.pdf',
      } as any);

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('PDF content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockResolvedValue(createMockTextResult('Text'));

      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: 'Context',
        caseStudyContext: 'Case study',
      });

      // OpenAI fails
      openaiService.evaluateCV.mockRejectedValue(new Error('OpenAI API error'));

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('OpenAI API error');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should handle database transaction failure', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue({
        cloudinaryUrl: 'https://cloudinary.com/file.pdf',
      } as any);

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('PDF content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockResolvedValue(createMockTextResult('Text'));

      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      openaiService.evaluateCV.mockResolvedValue({
        matchRate: 0.8,
        feedback: 'Good',
      });
      openaiService.scoreProject.mockResolvedValue({
        score: 4.0,
        feedback: 'Good',
      });
      openaiService.generateSummary.mockResolvedValue('Summary');

      // Transaction fails
      const mockQueryRunner = dataSource.createQueryRunner();
      mockQueryRunner.rollbackTransaction = jest.fn();
      resultRepository.createResultWithTransaction.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('Database error');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });

    it('should handle empty PDF text extraction', async () => {
      // Arrange
      const jobData = {
        evaluationId: 'eval-123',
        jobTitle: 'Senior Backend Developer',
        cvFileId: 'cv-456',
        projectFileId: 'project-789',
      };

      const mockCvFile = {
        id: 'cv-456',
        cloudinaryUrl: 'https://cloudinary.com/cv.pdf',
      };

      evaluationRepository.findById.mockResolvedValue({ id: 'eval-123' } as any);
      evaluationRepository.updateStatus.mockResolvedValue(undefined);
      uploadRepository.findById.mockResolvedValue(mockCvFile as any);

      mockAxios.get = jest.fn().mockResolvedValue({ data: Buffer.from('PDF content') });

      jest.spyOn(PDFParse.prototype, 'getText').mockResolvedValue(createMockTextResult('')); // Empty text

      // Mock ChromaDB (will be called in Promise.all)
      chromadbService.searchEvaluationContext.mockResolvedValue({
        jobContext: '',
        caseStudyContext: '',
      });

      // Act & Assert
      await expect(
        worker.processEvaluation({ data: jobData } as any),
      ).rejects.toThrow('CV PDF contains no extractable text');

      expect(evaluationRepository.updateStatus).toHaveBeenCalledWith(
        'eval-123',
        EvaluationStatus.FAILED,
      );
    });
  });
});
