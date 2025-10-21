import { Test, TestingModule } from '@nestjs/testing';

import { OpenAIService } from './openai.service';

describe('OpenAIService', () => {
  let service: OpenAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAIService],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseCVEvaluationResponse', () => {
    it('should parse valid CV evaluation response', () => {
      const response = `
MATCH_RATE: 0.85
FEEDBACK: Strong technical skills with 5 years of backend development. Excellent TypeScript and NestJS experience. Some gaps in DevOps knowledge.
      `;

      const result = service['parseCVEvaluationResponse'](response);

      expect(result.matchRate).toBe(0.85);
      expect(result.feedback).toContain('Strong technical skills');
    });

    it('should throw error for invalid format', () => {
      const response = 'Invalid response without proper format';

      expect(() => service['parseCVEvaluationResponse'](response)).toThrow(
        'Invalid response format from OpenAI for CV evaluation',
      );
    });

    it('should throw error for invalid match rate', () => {
      const response = `
MATCH_RATE: 1.5
FEEDBACK: Some feedback
      `;

      expect(() => service['parseCVEvaluationResponse'](response)).toThrow(
        'Invalid match rate from OpenAI',
      );
    });
  });

  describe('parseProjectScoringResponse', () => {
    it('should parse valid project scoring response', () => {
      const response = `
SCORE: 4.2
FEEDBACK: Excellent implementation with clean code. Good error handling and documentation. Could improve test coverage.
      `;

      const result = service['parseProjectScoringResponse'](response);

      expect(result.score).toBe(4.2);
      expect(result.feedback).toContain('Excellent implementation');
    });

    it('should throw error for invalid format', () => {
      const response = 'Invalid response without proper format';

      expect(() => service['parseProjectScoringResponse'](response)).toThrow(
        'Invalid response format from OpenAI for project scoring',
      );
    });

    it('should throw error for invalid score', () => {
      const response = `
SCORE: 6.5
FEEDBACK: Some feedback
      `;

      expect(() => service['parseProjectScoringResponse'](response)).toThrow(
        'Invalid score from OpenAI',
      );
    });
  });

  describe('buildCVEvaluationPrompt', () => {
    it('should build proper CV evaluation prompt', () => {
      const prompt = service['buildCVEvaluationPrompt'](
        'CV text here',
        'Senior Backend Developer',
        'Job requires TypeScript, NestJS, PostgreSQL',
      );

      expect(prompt).toContain('Senior Backend Developer');
      expect(prompt).toContain('CV text here');
      expect(prompt).toContain('Job requires TypeScript, NestJS, PostgreSQL');
      expect(prompt).toContain('MATCH_RATE');
      expect(prompt).toContain('FEEDBACK');
    });
  });

  describe('buildProjectScoringPrompt', () => {
    it('should build proper project scoring prompt', () => {
      const prompt = service['buildProjectScoringPrompt'](
        'Project implementation',
        'Backend Developer',
        'Build a REST API with authentication',
      );

      expect(prompt).toContain('Backend Developer');
      expect(prompt).toContain('Project implementation');
      expect(prompt).toContain('Build a REST API with authentication');
      expect(prompt).toContain('SCORE');
      expect(prompt).toContain('FEEDBACK');
    });
  });

  describe('buildSummaryPrompt', () => {
    it('should build proper summary prompt', () => {
      const prompt = service['buildSummaryPrompt']({
        cvMatchRate: 0.85,
        cvFeedback: 'Strong candidate',
        projectScore: 4.2,
        projectFeedback: 'Excellent work',
        jobTitle: 'Senior Developer',
      });

      expect(prompt).toContain('Senior Developer');
      expect(prompt).toContain('85%');
      expect(prompt).toContain('Strong candidate');
      expect(prompt).toContain('4.2');
      expect(prompt).toContain('Excellent work');
    });
  });
});
