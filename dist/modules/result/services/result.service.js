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
exports.ResultService = void 0;
const common_1 = require("@nestjs/common");
const evaluation_status_enum_1 = require("../../../common/enums/evaluation-status.enum");
const evaluation_repository_1 = require("../../evaluation/repositories/evaluation.repository");
const evaluation_result_dto_1 = require("../dto/response/evaluation-result.dto");
const result_response_dto_1 = require("../dto/response/result-response.dto");
const result_repository_1 = require("../repositories/result.repository");
let ResultService = class ResultService {
    evaluationRepository;
    resultRepository;
    constructor(evaluationRepository, resultRepository) {
        this.evaluationRepository = evaluationRepository;
        this.resultRepository = resultRepository;
    }
    async getResult(id) {
        const evaluation = await this.evaluationRepository.findById(id);
        if (!evaluation) {
            throw new common_1.NotFoundException(`Evaluation with id ${id} not found`);
        }
        switch (evaluation.status) {
            case evaluation_status_enum_1.EvaluationStatus.PENDING:
                return result_response_dto_1.ResultResponseDto.fromPending(evaluation.id, evaluation_status_enum_1.EvaluationStatus.PENDING);
            case evaluation_status_enum_1.EvaluationStatus.IN_PROGRESS:
                return result_response_dto_1.ResultResponseDto.fromPending(evaluation.id, evaluation_status_enum_1.EvaluationStatus.IN_PROGRESS);
            case evaluation_status_enum_1.EvaluationStatus.COMPLETED: {
                const result = await this.resultRepository.findByEvaluationId(evaluation.id);
                if (!result) {
                    throw new common_1.NotFoundException(`Result for evaluation ${id} not found despite completed status`);
                }
                const resultDto = evaluation_result_dto_1.EvaluationResultDto.from(result.cvMatchRate, result.cvFeedback, result.projectScore, result.projectFeedback, result.overallSummary);
                return result_response_dto_1.ResultResponseDto.fromCompleted(evaluation.id, resultDto);
            }
            case evaluation_status_enum_1.EvaluationStatus.FAILED:
                return result_response_dto_1.ResultResponseDto.fromFailed(evaluation.id);
            default:
                throw new Error(`Unknown evaluation status: ${evaluation.status}`);
        }
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [evaluation_repository_1.EvaluationRepository,
        result_repository_1.ResultRepository])
], ResultService);
//# sourceMappingURL=result.service.js.map