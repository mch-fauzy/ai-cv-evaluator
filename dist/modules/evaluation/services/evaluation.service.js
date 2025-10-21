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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const evaluation_status_enum_1 = require("../../../common/enums/evaluation-status.enum");
const queue_constant_1 = require("../../../common/constants/queue.constant");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const upload_repository_1 = require("../../upload/repositories/upload.repository");
const transaction_util_1 = require("../../../utils/transaction.util");
const evaluation_response_dto_1 = require("../dto/response/evaluation-response.dto");
const evaluation_list_item_dto_1 = require("../dto/response/evaluation-list-item.dto");
const evaluation_repository_1 = require("../repositories/evaluation.repository");
const evaluation_queue_service_1 = require("./evaluation-queue.service");
let EvaluationService = class EvaluationService {
    dataSource;
    evaluationRepository;
    uploadRepository;
    queueService;
    constructor(dataSource, evaluationRepository, uploadRepository, queueService) {
        this.dataSource = dataSource;
        this.evaluationRepository = evaluationRepository;
        this.uploadRepository = uploadRepository;
        this.queueService = queueService;
    }
    async createEvaluation(data) {
        const files = await this.uploadRepository.findByIds([
            data.cvFileId,
            data.projectFileId,
        ]);
        if (files.length !== 2) {
            const missingIds = [data.cvFileId, data.projectFileId].filter((id) => !files.find((f) => f.id === id));
            throw new common_1.NotFoundException(`Files not found: ${missingIds.join(', ')}`);
        }
        const evaluation = await transaction_util_1.TransactionUtil.execute(this.dataSource, async (queryRunner) => {
            const newEvaluation = await this.evaluationRepository.createWithTransaction(queryRunner, {
                jobTitle: data.jobTitle,
                cvFileId: data.cvFileId,
                projectFileId: data.projectFileId,
                status: evaluation_status_enum_1.EvaluationStatus.PENDING,
            });
            const jobData = {
                evaluationId: newEvaluation.id,
                jobTitle: newEvaluation.jobTitle,
                cvFileId: newEvaluation.cvFileId,
                projectFileId: newEvaluation.projectFileId,
            };
            await this.queueService.addJob(queue_constant_1.JOB_NAMES.PROCESS_EVALUATION, jobData);
            return newEvaluation;
        });
        return evaluation_response_dto_1.EvaluationResponseDto.from(evaluation.id, evaluation.status);
    }
    async getList(query) {
        const { evaluations, totalEvaluations } = await this.evaluationRepository.getList(query.page, query.limit);
        return {
            metadata: pagination_util_1.PaginationUtil.mapMetadata({
                count: totalEvaluations,
                page: query.page,
                perPage: query.limit,
            }),
            items: evaluation_list_item_dto_1.EvaluationListItemDto.fromList(evaluations),
        };
    }
};
exports.EvaluationService = EvaluationService;
exports.EvaluationService = EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        evaluation_repository_1.EvaluationRepository,
        upload_repository_1.UploadRepository,
        evaluation_queue_service_1.EvaluationQueueService])
], EvaluationService);
//# sourceMappingURL=evaluation.service.js.map