import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

import { openaiConfig } from '../../config';

/**
 * OpenAI service for GPT-based AI operations
 * Provides CV evaluation and project scoring using GPT-4o-mini
 */
@Injectable()
export class OpenAIService {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: openaiConfig.API_KEY,
    });
  }

  /**
   * Evaluate CV against job requirements
   * Returns match rate (0-1) and detailed feedback
   */
  async evaluateCV(params: {
    cvText: string;
    jobTitle: string;
    jobContext: string;
  }): Promise<{
    matchRate: number;
    feedback: string;
  }> {
    try {
      const prompt = this.buildCVEvaluationPrompt(
        params.cvText,
        params.jobTitle,
        params.jobContext,
      );

      const completion = await this.client.chat.completions.create({
        model: openaiConfig.MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert technical recruiter evaluating CVs against job requirements. Provide honest, constructive feedback.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: openaiConfig.TEMPERATURE,
        max_tokens: openaiConfig.MAX_TOKENS,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new BadRequestException('Empty response from OpenAI');
      }

      return this.parseCVEvaluationResponse(response);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to evaluate CV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Score project deliverable against rubric
   * Returns score (1-5) and detailed feedback
   */
  async scoreProject(params: {
    projectText: string;
    jobTitle: string;
    caseStudyContext: string;
  }): Promise<{
    score: number;
    feedback: string;
  }> {
    try {
      const prompt = this.buildProjectScoringPrompt(
        params.projectText,
        params.jobTitle,
        params.caseStudyContext,
      );

      const completion = await this.client.chat.completions.create({
        model: openaiConfig.MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert technical evaluator scoring project submissions. Provide fair, detailed assessments based on the rubric.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: openaiConfig.TEMPERATURE,
        max_tokens: openaiConfig.MAX_TOKENS,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      return this.parseProjectScoringResponse(response);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to score project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate overall summary of evaluation
   */
  async generateSummary(params: {
    cvMatchRate: number;
    cvFeedback: string;
    projectScore: number;
    projectFeedback: string;
    jobTitle: string;
  }): Promise<string> {
    try {
      const prompt = this.buildSummaryPrompt(params);

      const completion = await this.client.chat.completions.create({
        model: openaiConfig.MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert recruiter writing concise evaluation summaries. Focus on key strengths, gaps, and recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: openaiConfig.SUMMARY_TEMPERATURE,
        max_tokens: openaiConfig.SUMMARY_MAX_TOKENS,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Empty response from OpenAI');
      }

      return response.trim();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Build prompt for CV evaluation
   */
  private buildCVEvaluationPrompt(
    cvText: string,
    jobTitle: string,
    jobContext: string,
  ): string {
    return `
You are evaluating a candidate for the position: ${jobTitle}

=== REFERENCE: Job Requirements (Use this as criteria ONLY, NOT as candidate information) ===
${jobContext}

=== CANDIDATE'S ACTUAL CV (Evaluate ONLY the content below) ===
${cvText}

=== IMPORTANT INSTRUCTIONS ===
- Evaluate ONLY what is present in the candidate's CV section above
- DO NOT assume the candidate has any skills from the job requirements unless explicitly stated in their CV
- If the CV is incomplete or contains insufficient information, state this clearly
- DO NOT confuse the job requirements with the candidate's actual qualifications

Evaluation Criteria:
1. Technical Skills (40%): Rate 1-5 how well the candidate's stated skills match the job requirements
2. Experience (25%): Rate 1-5 the relevance and depth of experience shown in the CV
3. Achievements (20%): Rate 1-5 the quality and relevance of accomplishments in the CV
4. Culture Fit (15%): Rate 1-5 based on communication style and career trajectory in the CV

Provide your evaluation in this exact format:
MATCH_RATE: [weighted average as decimal 0-1, e.g., 0.75]
FEEDBACK: [3-5 sentences covering strengths, gaps, and overall fit based ONLY on the actual CV content]

Example format:
MATCH_RATE: 0.82
FEEDBACK: Strong technical background with 5+ years in backend development. Excellent experience with TypeScript and NestJS. Missing some DevOps skills mentioned in the requirements. Good culture fit based on clear communication in CV.
`;
  }

  /**
   * Build prompt for project scoring
   */
  private buildProjectScoringPrompt(
    projectText: string,
    jobTitle: string,
    caseStudyContext: string,
  ): string {
    return `
You are evaluating a project submission for the position: ${jobTitle}

=== REFERENCE: Case Study Requirements (Use this as criteria ONLY) ===
${caseStudyContext}

=== CANDIDATE'S ACTUAL PROJECT SUBMISSION (Evaluate ONLY the content below) ===
${projectText}

=== IMPORTANT INSTRUCTIONS ===
- Evaluate ONLY what is present in the candidate's project submission above
- DO NOT assume features exist unless explicitly described in the submission
- If the submission is incomplete or contains insufficient information, state this clearly
- DO NOT confuse the case study requirements with what was actually implemented

Scoring Criteria:
1. Correctness/Chaining/RAG (30%): How well does the actual submission solve the problem?
2. Code Quality (25%): Clean code, best practices, architecture shown in submission
3. Resilience & Error Handling (20%): Edge cases, error handling, validation in submission
4. Documentation (15%): README, code comments, API docs present in submission
5. Creativity (10%): Novel approaches, extra features, polish shown in submission

Provide your evaluation in this exact format:
SCORE: [overall score 1-5 as decimal, e.g., 4.2]
FEEDBACK: [3-5 sentences covering implementation quality, strengths, and areas for improvement based ONLY on actual submission]

Example format:
SCORE: 4.3
FEEDBACK: Excellent implementation with proper RAG pipeline. Clean TypeScript code following NestJS best practices. Good error handling with custom exceptions. Comprehensive README with setup instructions. Could improve with more unit tests.
`;
  }

  /**
   * Build prompt for overall summary
   */
  private buildSummaryPrompt(params: {
    cvMatchRate: number;
    cvFeedback: string;
    projectScore: number;
    projectFeedback: string;
    jobTitle: string;
  }): string {
    return `
Generate a concise overall evaluation summary for a ${params.jobTitle} candidate.

CV Match Rate: ${(params.cvMatchRate * 100).toFixed(0)}%
CV Feedback: ${params.cvFeedback}

Project Score: ${params.projectScore}/5
Project Feedback: ${params.projectFeedback}

Provide a 3-5 sentence summary covering:
1. Key strengths that stand out
2. Notable gaps or areas for improvement
3. Overall recommendation (Strong Hire / Hire / Maybe / No Hire)

Keep it professional, balanced, and actionable.
`;
  }

  /**
   * Parse CV evaluation response
   */
  private parseCVEvaluationResponse(response: string): {
    matchRate: number;
    feedback: string;
  } {
    const matchRateMatch = response.match(/MATCH_RATE:\s*([\d.]+)/i);
    const feedbackMatch = response.match(/FEEDBACK:\s*(.+)/is);

    if (!matchRateMatch || !feedbackMatch) {
      throw new Error('Invalid response format from OpenAI for CV evaluation');
    }

    const matchRate = parseFloat(matchRateMatch[1]);
    const feedback = feedbackMatch[1].trim();

    // Validate match rate is between 0 and 1
    if (isNaN(matchRate) || matchRate < 0 || matchRate > 1) {
      throw new Error('Invalid match rate from OpenAI');
    }

    return {
      matchRate,
      feedback,
    };
  }

  /**
   * Parse project scoring response
   */
  private parseProjectScoringResponse(response: string): {
    score: number;
    feedback: string;
  } {
    const scoreMatch = response.match(/SCORE:\s*([\d.]+)/i);
    const feedbackMatch = response.match(/FEEDBACK:\s*(.+)/is);

    if (!scoreMatch || !feedbackMatch) {
      throw new Error('Invalid response format from OpenAI for project scoring');
    }

    const score = parseFloat(scoreMatch[1]);
    const feedback = feedbackMatch[1].trim();

    // Validate score is between 1 and 5
    if (isNaN(score) || score < 1 || score > 5) {
      throw new Error('Invalid score from OpenAI');
    }

    return {
      score,
      feedback,
    };
  }
}
