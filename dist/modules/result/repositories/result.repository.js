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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const result_entity_1 = require("../entities/result.entity");
let ResultRepository = class ResultRepository {
    resultRepo;
    constructor(resultRepo) {
        this.resultRepo = resultRepo;
    }
    async create(data) {
        const result = this.resultRepo.create(data);
        return await this.resultRepo.save(result);
    }
    async createResult(data) {
        const result = this.resultRepo.create({
            evaluationId: data.evaluationId,
            cvMatchRate: data.cvMatchRate,
            cvFeedback: data.cvFeedback,
            projectScore: data.projectScore,
            projectFeedback: data.projectFeedback,
            overallSummary: data.summary,
        });
        return await this.resultRepo.save(result);
    }
    async findByEvaluationId(evaluationId) {
        return await this.resultRepo.findOne({
            where: { evaluationId },
            relations: ['evaluation'],
        });
    }
    async findOrFailByEvaluationId(evaluationId) {
        const result = await this.resultRepo.findOne({
            where: { evaluationId },
            relations: ['evaluation'],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Result for evaluation ${evaluationId} not found`);
        }
        return result;
    }
    async createResultWithTransaction(queryRunner, data) {
        const result = queryRunner.manager.create(result_entity_1.Result, {
            evaluationId: data.evaluationId,
            cvMatchRate: data.cvMatchRate,
            cvFeedback: data.cvFeedback,
            projectScore: data.projectScore,
            projectFeedback: data.projectFeedback,
            overallSummary: data.summary,
        });
        return await queryRunner.manager.save(result);
    }
};
exports.ResultRepository = ResultRepository;
exports.ResultRepository = ResultRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(result_entity_1.Result)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResultRepository);
//# sourceMappingURL=result.repository.js.map