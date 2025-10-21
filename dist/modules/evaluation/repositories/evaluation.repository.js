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
exports.EvaluationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const evaluation_status_enum_1 = require("../../../common/enums/evaluation-status.enum");
const evaluation_entity_1 = require("../entities/evaluation.entity");
let EvaluationRepository = class EvaluationRepository {
    evaluationRepo;
    constructor(evaluationRepo) {
        this.evaluationRepo = evaluationRepo;
    }
    async create(data) {
        const evaluation = this.evaluationRepo.create(data);
        return await this.evaluationRepo.save(evaluation);
    }
    async createWithTransaction(queryRunner, data) {
        const evaluation = queryRunner.manager.create(evaluation_entity_1.Evaluation, data);
        return await queryRunner.manager.save(evaluation);
    }
    async findById(id) {
        return await this.evaluationRepo.findOne({
            where: { id },
            relations: ['cvFile', 'projectFile'],
        });
    }
    async findOrFailById(id) {
        const evaluation = await this.evaluationRepo.findOne({
            where: { id },
            relations: ['cvFile', 'projectFile'],
        });
        if (!evaluation) {
            throw new common_1.NotFoundException(`Evaluation with id ${id} not found`);
        }
        return evaluation;
    }
    async findPendingJobs() {
        return await this.evaluationRepo.find({
            where: { status: evaluation_status_enum_1.EvaluationStatus.PENDING },
            relations: ['cvFile', 'projectFile'],
            order: { createdAt: 'ASC' },
        });
    }
    async updateStatus(id, status) {
        await this.evaluationRepo.update(id, { status });
    }
    async updateById(id, data) {
        const evaluation = await this.findOrFailById(id);
        await this.evaluationRepo.save(Object.assign(evaluation, data));
    }
    async updateStatusWithTransaction(queryRunner, id, status) {
        await queryRunner.manager.update(evaluation_entity_1.Evaluation, id, { status });
    }
    async getList(page, limit) {
        const skip = (page - 1) * limit;
        const [evaluations, totalEvaluations] = await this.evaluationRepo.findAndCount({
            relations: ['cvFile', 'projectFile'],
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
        return { evaluations, totalEvaluations };
    }
};
exports.EvaluationRepository = EvaluationRepository;
exports.EvaluationRepository = EvaluationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(evaluation_entity_1.Evaluation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EvaluationRepository);
//# sourceMappingURL=evaluation.repository.js.map