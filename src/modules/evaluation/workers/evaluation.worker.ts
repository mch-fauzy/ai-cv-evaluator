import { Logger, NotFoundException } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { PDFParse } from 'pdf-parse';
import axios from 'axios';
import { DataSource } from 'typeorm';

import { EvaluationJobData } from '../interfaces/evaluation-job-data.interface';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { ResultRepository } from '../../result/repositories/result.repository';
import { UploadRepository } from '../../upload/repositories/upload.repository';
import { OpenAIService } from '../../externals/openai/services/openai.service';
import { ChromaDBService } from '../../externals/chromadb/services/chromadb.service';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { QUEUE_NAMES, JOB_NAMES } from '../../../common/constants/queue.constant';
import { TransactionUtil } from '../../../common/utils/transaction.util';

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
@Processor(QUEUE_NAMES.evaluation)
export class EvaluationWorker {
  private readonly logger = new Logger(EvaluationWorker.name);

  constructor(
    private readonly dataSource: DataSource,
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
  @Process(JOB_NAMES.processEvaluation)
  async processEvaluation(job: Job<EvaluationJobData>): Promise<void> {
    const { evaluationId, jobTitle, cvFileId, projectFileId } = job.data;

    this.logger.log(
      `Processing evaluation job ${job.id} for evaluation ${evaluationId}`,
    );

    try {
      // Update status to IN_PROGRESS
      await this.evaluationRepository.updateStatus(
        evaluationId,
        EvaluationStatus.IN_PROGRESS,
      );
      this.logger.log(`Evaluation ${evaluationId} status updated to IN_PROGRESS`);

      // Download and extract text from both PDFs + ChromaDB context
      const [cvText, projectText, chromaResults] = await Promise.all([
        this.downloadAndExtractPDF(cvFileId, 'CV'),
        this.downloadAndExtractPDF(projectFileId, 'Project'),
        this.chromadbService
          .searchEvaluationContext({ jobTitle })
          .catch((error) => {
            this.logger.warn(
              `ChromaDB search failed, continuing without RAG context: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
            return { jobContext: '', caseStudyContext: '' };
          }),
      ]);

      this.logger.log(`CV text extracted (${cvText.length} characters)`);
      this.logger.log(
        `Project text extracted (${projectText.length} characters)`,
      );
      if (chromaResults.jobContext || chromaResults.caseStudyContext) {
        this.logger.log('Retrieved context from ChromaDB');
      }

      const { jobContext, caseStudyContext } = chromaResults;

      // Evaluate CV and score project simultaneously
      const [cvEvaluation, projectEvaluation] = await Promise.all([
        this.openaiService.evaluateCV({
          cvText,
          jobTitle,
          jobContext,
        }),
        this.openaiService.scoreProject({
          projectText,
          jobTitle,
          caseStudyContext,
        }),
      ]);

      this.logger.log(
        `CV evaluated: match rate = ${cvEvaluation.matchRate.toFixed(2)}`,
      );
      this.logger.log(
        `Project scored: score = ${projectEvaluation.score.toFixed(2)}`,
      );

      // Generate overall summary
      const summary = await this.openaiService.generateSummary({
        cvMatchRate: cvEvaluation.matchRate,
        cvFeedback: cvEvaluation.feedback,
        projectScore: projectEvaluation.score,
        projectFeedback: projectEvaluation.feedback,
        jobTitle,
      });
      this.logger.log('Generated evaluation summary');

      // Save results and update status in a transaction
      await TransactionUtil.execute(this.dataSource, async (queryRunner) => {
        // Save results to database
        await this.resultRepository.createResultWithTransaction(queryRunner, {
          evaluationId,
          cvMatchRate: cvEvaluation.matchRate,
          cvFeedback: cvEvaluation.feedback,
          projectScore: projectEvaluation.score,
          projectFeedback: projectEvaluation.feedback,
          summary,
        });

        // Update evaluation status to COMPLETED
        await this.evaluationRepository.updateStatusWithTransaction(
          queryRunner,
          evaluationId,
          EvaluationStatus.COMPLETED,
        );
      });

      this.logger.log(`Evaluation ${evaluationId} completed successfully`);
    } catch (error) {
      // Handle errors and update status to FAILED
      this.logger.error(
        `Error processing evaluation ${evaluationId}:`,
        error instanceof Error ? error.message : String(error),
      );

      // Update evaluation status to FAILED
      await this.evaluationRepository.updateStatus(
        evaluationId,
        EvaluationStatus.FAILED,
      );

      throw error;
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
        throw new NotFoundException(`${fileType} file ${fileId} not found in database`);
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
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse(uint8Array);
      const result = await parser.getText();
      const text = result.text;

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
