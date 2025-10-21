"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EvaluationWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationWorker = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const pdf_parse_1 = require("pdf-parse");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
const evaluation_repository_1 = require("../repositories/evaluation.repository");
const result_repository_1 = require("../../result/repositories/result.repository");
const upload_repository_1 = require("../../upload/repositories/upload.repository");
const openai_service_1 = require("../../externals/openai/services/openai.service");
const chromadb_service_1 = require("../../externals/chromadb/services/chromadb.service");
const evaluation_status_enum_1 = require("../../../common/enums/evaluation-status.enum");
const queue_constant_1 = require("../../../common/constants/queue.constant");
const transaction_util_1 = require("../../../utils/transaction.util");
let EvaluationWorker = EvaluationWorker_1 = class EvaluationWorker {
    dataSource;
    evaluationRepository;
    resultRepository;
    uploadRepository;
    openaiService;
    chromadbService;
    logger = new common_1.Logger(EvaluationWorker_1.name);
    constructor(dataSource, evaluationRepository, resultRepository, uploadRepository, openaiService, chromadbService) {
        this.dataSource = dataSource;
        this.evaluationRepository = evaluationRepository;
        this.resultRepository = resultRepository;
        this.uploadRepository = uploadRepository;
        this.openaiService = openaiService;
        this.chromadbService = chromadbService;
    }
    async processEvaluation(job) {
        const { evaluationId, jobTitle, cvFileId, projectFileId } = job.data;
        this.logger.log(`Processing evaluation job ${job.id} for evaluation ${evaluationId}`);
        try {
            await this.evaluationRepository.updateStatus(evaluationId, evaluation_status_enum_1.EvaluationStatus.IN_PROGRESS);
            this.logger.log(`Evaluation ${evaluationId} status updated to IN_PROGRESS`);
            const [cvText, projectText, chromaResults] = await Promise.all([
                this.downloadAndExtractPDF(cvFileId, 'CV'),
                this.downloadAndExtractPDF(projectFileId, 'Project'),
                this.chromadbService
                    .searchEvaluationContext({ jobTitle })
                    .catch((error) => {
                    this.logger.warn(`ChromaDB search failed, continuing without RAG context: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    return { jobContext: '', caseStudyContext: '' };
                }),
            ]);
            this.logger.log(`CV text extracted (${cvText.length} characters)`);
            this.logger.log(`Project text extracted (${projectText.length} characters)`);
            if (chromaResults.jobContext || chromaResults.caseStudyContext) {
                this.logger.log('Retrieved context from ChromaDB');
            }
            const { jobContext, caseStudyContext } = chromaResults;
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
            this.logger.log(`CV evaluated: match rate = ${cvEvaluation.matchRate.toFixed(2)}`);
            this.logger.log(`Project scored: score = ${projectEvaluation.score.toFixed(2)}`);
            const summary = await this.openaiService.generateSummary({
                cvMatchRate: cvEvaluation.matchRate,
                cvFeedback: cvEvaluation.feedback,
                projectScore: projectEvaluation.score,
                projectFeedback: projectEvaluation.feedback,
                jobTitle,
            });
            this.logger.log('Generated evaluation summary');
            await transaction_util_1.TransactionUtil.execute(this.dataSource, async (queryRunner) => {
                await this.resultRepository.createResultWithTransaction(queryRunner, {
                    evaluationId,
                    cvMatchRate: cvEvaluation.matchRate,
                    cvFeedback: cvEvaluation.feedback,
                    projectScore: projectEvaluation.score,
                    projectFeedback: projectEvaluation.feedback,
                    summary,
                });
                await this.evaluationRepository.updateStatusWithTransaction(queryRunner, evaluationId, evaluation_status_enum_1.EvaluationStatus.COMPLETED);
            });
            this.logger.log(`Evaluation ${evaluationId} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Error processing evaluation ${evaluationId}:`, error instanceof Error ? error.message : String(error));
            await this.evaluationRepository.updateStatus(evaluationId, evaluation_status_enum_1.EvaluationStatus.FAILED);
            throw error;
        }
    }
    async downloadAndExtractPDF(fileId, fileType) {
        try {
            const upload = await this.uploadRepository.findById(fileId);
            if (!upload) {
                throw new common_1.NotFoundException(`${fileType} file ${fileId} not found in database`);
            }
            this.logger.log(`Downloading ${fileType} from Cloudinary: ${upload.cloudinaryUrl}`);
            const response = await axios_1.default.get(upload.cloudinaryUrl, {
                responseType: 'arraybuffer',
                timeout: 30000,
            });
            if (!response.data) {
                throw new Error(`Failed to download ${fileType} from Cloudinary`);
            }
            const buffer = Buffer.from(response.data);
            const uint8Array = new Uint8Array(buffer);
            const parser = new pdf_parse_1.PDFParse(uint8Array);
            const result = await parser.getText();
            const text = result.text;
            if (!text || text.trim().length === 0) {
                throw new Error(`${fileType} PDF contains no extractable text`);
            }
            return text;
        }
        catch (error) {
            this.logger.error(`Error downloading/parsing ${fileType}:`, error instanceof Error ? error.message : String(error));
            throw new Error(`Failed to process ${fileType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.EvaluationWorker = EvaluationWorker;
__decorate([
    (0, bull_1.Process)(queue_constant_1.JOB_NAMES.PROCESS_EVALUATION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationWorker.prototype, "processEvaluation", null);
exports.EvaluationWorker = EvaluationWorker = EvaluationWorker_1 = __decorate([
    (0, bull_1.Processor)(queue_constant_1.QUEUE_NAMES.EVALUATION),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        evaluation_repository_1.EvaluationRepository,
        result_repository_1.ResultRepository,
        upload_repository_1.UploadRepository,
        openai_service_1.OpenAIService,
        chromadb_service_1.ChromaDBService])
], EvaluationWorker);
//# sourceMappingURL=evaluation.worker.js.map