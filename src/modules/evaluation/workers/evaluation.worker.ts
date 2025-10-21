import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import {PDFParse} from 'pdf-parse';
import axios from 'axios';

import { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ResultRepository } from '../../result/repositories/result.repository';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { OpenAIService } from '../../../externals/openai/openai.service';
import { ChromaDBService } from '../../../externals/chromadb/chromadb.service';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { QUEUE_NAMES, JOB_NAMES } from '../../../common/constants/queue.constant';

/**
 * Worker processor for CV evaluation jobs.
 * Handles the complete evaluation workflow:
 * 1. Fetch evaluation record and related files
 * 2. Download and parse CV/project PDFs
 * 3. Query ChromaDB for contextual information (RAG)
 * 4. Evaluate CV and score project using OpenAI
 * 5. Generate summary
 * 6. Save results to database
 * 7. Update evaluation status
 */
@Processor(QUEUE_NAMES.EVALUATION)
export class EvaluationWorker {
  private readonly logger = new Logger(EvaluationWorker.name);

  constructor(
    private readonly evaluationRepository: EvaluationRepository,
    private readonly resultRepository: ResultRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly openaiService: OpenAIService,
    private readonly chromadbService: ChromaDBService,
  ) {}

  /**
   * Process evaluation job
   * This method is automatically called by Bull when a job is added to the queue
   */
  @Process(JOB_NAMES.PROCESS_EVALUATION)
  async processEvaluation(job: Job<EvaluationJobData>): Promise<void> {
    const { evaluationId, jobTitle, cvFileId, projectFileId } = job.data;

    this.logger.log(
      `Processing evaluation job ${job.id} for evaluation ${evaluationId}`,
    );

    try {
      // Step 1: Fetch evaluation record and update status
      const evaluation = await this.evaluationRepository.findById(evaluationId);
      if (!evaluation) {
        throw new Error(`Evaluation ${evaluationId} not found`);
      }

      await this.evaluationRepository.updateStatus(
        evaluationId,
        EvaluationStatus.IN_PROGRESS,
      );
      this.logger.log(`Evaluation ${evaluationId} status updated to IN_PROGRESS`);

      // Step 2: Download and extract text from CV
      const cvText = await this.downloadAndExtractPDF(cvFileId, 'CV');
      this.logger.log(`CV text extracted (${cvText.length} characters)`);

      // Step 3: Download and extract text from project
      const projectText = await this.downloadAndExtractPDF(
        projectFileId,
        'Project',
      );
      this.logger.log(
        `Project text extracted (${projectText.length} characters)`,
      );

      // Step 4: Query ChromaDB for contextual information (RAG)
      const { jobContext, caseStudyContext } =
        await this.chromadbService.searchEvaluationContext({ jobTitle });
      this.logger.log('Retrieved context from ChromaDB');

      // Step 5: Evaluate CV using OpenAI
      const cvEvaluation = await this.openaiService.evaluateCV({
        cvText,
        jobTitle,
        jobContext,
      });
      this.logger.log(
        `CV evaluated: match rate = ${cvEvaluation.matchRate.toFixed(2)}`,
      );

      // Step 6: Score project using OpenAI
      const projectEvaluation = await this.openaiService.scoreProject({
        projectText,
        jobTitle,
        caseStudyContext,
      });
      this.logger.log(
        `Project scored: score = ${projectEvaluation.score.toFixed(2)}`,
      );

      // Step 7: Generate overall summary
      const summary = await this.openaiService.generateSummary({
        cvMatchRate: cvEvaluation.matchRate,
        cvFeedback: cvEvaluation.feedback,
        projectScore: projectEvaluation.score,
        projectFeedback: projectEvaluation.feedback,
        jobTitle,
      });
      this.logger.log('Generated evaluation summary');

      // Step 8: Save results to database
      await this.resultRepository.createResult({
        evaluationId,
        cvMatchRate: cvEvaluation.matchRate,
        cvFeedback: cvEvaluation.feedback,
        projectScore: projectEvaluation.score,
        projectFeedback: projectEvaluation.feedback,
        summary,
        recommendation: summary, // Same as summary for now
      });
      this.logger.log('Results saved to database');

      // Step 9: Update evaluation status to COMPLETED
      await this.evaluationRepository.updateStatus(
        evaluationId,
        EvaluationStatus.COMPLETED,
      );
      this.logger.log(`Evaluation ${evaluationId} completed successfully`);
    } catch (error) {
      // Handle errors and update status to FAILED
      this.logger.error(
        `Error processing evaluation ${evaluationId}:`,
        error instanceof Error ? error.message : String(error),
      );

      await this.evaluationRepository.markFailed(
        evaluationId,
        error instanceof Error ? error.message : 'Unknown error occurred',
      );

      throw error; // Re-throw for Bull retry mechanism
    }
  }

  /**
   * Download file from Cloudinary and extract text from PDF.
   */
  private async downloadAndExtractPDF(
    fileId: string,
    fileType: string,
  ): Promise<string> {
    try {
      // Fetch upload record
      const upload = await this.uploadRepository.findById(fileId);
      if (!upload) {
        throw new Error(`${fileType} file ${fileId} not found in database`);
      }

      // Download file from Cloudinary
      this.logger.log(`Downloading ${fileType} from Cloudinary: ${upload.cloudinaryUrl}`);
      const response = await axios.get(upload.cloudinaryUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 seconds timeout
      });

      if (!response.data) {
        throw new Error(`Failed to download ${fileType} from Cloudinary`);
      }

      // Parse PDF and extract text
      const buffer = Buffer.from(response.data);
      const parser = new PDFParse(buffer);
      const textResult = await parser.getText();
      const text = textResult.text;

      if (!text || text.trim().length === 0) {
        throw new Error(`${fileType} PDF contains no extractable text`);
      }

      return text;
    } catch (error) {
      this.logger.error(
        `Error downloading/parsing ${fileType}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Failed to process ${fileType}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
