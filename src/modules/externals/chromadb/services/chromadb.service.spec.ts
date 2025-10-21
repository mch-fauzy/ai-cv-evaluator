import { Test, TestingModule } from '@nestjs/testing';

import { CHROMA_COLLECTIONS } from '../../../../common/constants/chromadb.constant';
import { ChromaDBService } from './chromadb.service';

describe('ChromaDBService', () => {
  let service: ChromaDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChromaDBService],
    }).compile();

    service = module.get<ChromaDBService>(ChromaDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Note: These are unit tests. Integration tests would require actual ChromaDB instance.
  // For now, we test the service structure and methods exist.

  describe('service methods', () => {
    it('should have searchJobContext method', () => {
      expect(service.searchJobContext).toBeDefined();
      expect(typeof service.searchJobContext).toBe('function');
    });

    it('should have searchCaseStudyContext method', () => {
      expect(service.searchCaseStudyContext).toBeDefined();
      expect(typeof service.searchCaseStudyContext).toBe('function');
    });

    it('should have searchEvaluationContext method', () => {
      expect(service.searchEvaluationContext).toBeDefined();
      expect(typeof service.searchEvaluationContext).toBe('function');
    });

    it('should have addJobDescription method', () => {
      expect(service.addJobDescription).toBeDefined();
      expect(typeof service.addJobDescription).toBe('function');
    });

    it('should have addCaseStudy method', () => {
      expect(service.addCaseStudy).toBeDefined();
      expect(typeof service.addCaseStudy).toBe('function');
    });

    it('should have getCollectionStats method', () => {
      expect(service.getCollectionStats).toBeDefined();
      expect(typeof service.getCollectionStats).toBe('function');
    });

    it('should have healthCheck method', () => {
      expect(service.healthCheck).toBeDefined();
      expect(typeof service.healthCheck).toBe('function');
    });
  });

  describe('collection name', () => {
    it('should use evaluation_context as collection name', () => {
      expect(service['collectionName']).toBe(
        CHROMA_COLLECTIONS.evaluationContext,
      );
    });
  });
});
