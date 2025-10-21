"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const upload_module_1 = require("../upload/upload.module");
const openai_module_1 = require("../externals/openai/openai.module");
const chromadb_module_1 = require("../externals/chromadb/chromadb.module");
const evaluation_controller_1 = require("./controllers/v1/evaluation.controller");
const evaluation_entity_1 = require("./entities/evaluation.entity");
const result_entity_1 = require("../result/entities/result.entity");
const evaluation_repository_1 = require("./repositories/evaluation.repository");
const evaluation_service_1 = require("./services/evaluation.service");
const evaluation_queue_service_1 = require("./services/evaluation-queue.service");
const evaluation_worker_1 = require("./workers/evaluation.worker");
const result_repository_1 = require("../result/repositories/result.repository");
const queue_constant_1 = require("../../common/constants/queue.constant");
let EvaluationModule = class EvaluationModule {
};
exports.EvaluationModule = EvaluationModule;
exports.EvaluationModule = EvaluationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([evaluation_entity_1.Evaluation, result_entity_1.Result]),
            bull_1.BullModule.registerQueue({
                name: queue_constant_1.QUEUE_NAMES.EVALUATION,
            }),
            upload_module_1.UploadModule,
            openai_module_1.OpenAIModule,
            chromadb_module_1.ChromaDBModule,
        ],
        controllers: [evaluation_controller_1.EvaluationController],
        providers: [
            evaluation_service_1.EvaluationService,
            evaluation_repository_1.EvaluationRepository,
            evaluation_queue_service_1.EvaluationQueueService,
            evaluation_worker_1.EvaluationWorker,
            result_repository_1.ResultRepository,
        ],
        exports: [evaluation_service_1.EvaluationService, evaluation_repository_1.EvaluationRepository],
    })
], EvaluationModule);
//# sourceMappingURL=evaluation.module.js.map