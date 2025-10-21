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
exports.Result = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const evaluation_entity_1 = require("../../evaluation/entities/evaluation.entity");
let Result = class Result extends base_entity_1.Base {
    evaluationId;
    evaluation;
    cvMatchRate;
    cvFeedback;
    projectScore;
    projectFeedback;
    overallSummary;
};
exports.Result = Result;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], Result.prototype, "evaluationId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => evaluation_entity_1.Evaluation),
    (0, typeorm_1.JoinColumn)({ name: 'evaluation_id' }),
    __metadata("design:type", evaluation_entity_1.Evaluation)
], Result.prototype, "evaluation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Result.prototype, "cvMatchRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Result.prototype, "cvFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Result.prototype, "projectScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Result.prototype, "projectFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Result.prototype, "overallSummary", void 0);
exports.Result = Result = __decorate([
    (0, typeorm_1.Entity)()
], Result);
//# sourceMappingURL=result.entity.js.map