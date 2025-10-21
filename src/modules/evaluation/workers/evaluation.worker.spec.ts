import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EvaluationWorker } from './evaluation.worker';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ResultRepository } from '../../result/repositories/result.repository';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { OpenAIService } from '../../../externals/openai/openai.service';
import { ChromaDBService } from '../../../externals/chromadb/chromadb.service';

describe('EvaluationWorker', () => {
  let worker: EvaluationWorker;
  let dataSource: jest.Mocked<DataSource>;
  let evaluationRepository: jest.Mocked<EvaluationRepository>;
  let resultRepository: jest.Mocked<ResultRepository>;
  let uploadRepository: jest.Mocked<UploadRepository>;
  let openaiService: jest.Mocked<OpenAIService>;
  let chromadbService: jest.Mocked<ChromaDBService>;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  // Note: Full integration tests for processEvaluation require:
  // - Redis connection
  // - PDF files from Cloudinary
  // - OpenAI API
  // - ChromaDB connection
  // These would be better suited for E2E tests
});
