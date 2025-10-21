"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const result_controller_1 = require("./controllers/v1/result.controller");
const result_entity_1 = require("./entities/result.entity");
const evaluation_entity_1 = require("../evaluation/entities/evaluation.entity");
const result_repository_1 = require("./repositories/result.repository");
const evaluation_repository_1 = require("../evaluation/repositories/evaluation.repository");
const result_service_1 = require("./services/result.service");
let ResultModule = class ResultModule {
};
exports.ResultModule = ResultModule;
exports.ResultModule = ResultModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([result_entity_1.Result, evaluation_entity_1.Evaluation])],
        controllers: [result_controller_1.ResultController],
        providers: [result_service_1.ResultService, result_repository_1.ResultRepository, evaluation_repository_1.EvaluationRepository],
        exports: [result_service_1.ResultService, result_repository_1.ResultRepository],
    })
], ResultModule);
//# sourceMappingURL=result.module.js.map