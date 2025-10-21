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
exports.Evaluation = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const evaluation_status_enum_1 = require("../../../common/enums/evaluation-status.enum");
const upload_entity_1 = require("../../upload/entities/upload.entity");
let Evaluation = class Evaluation extends base_entity_1.Base {
    jobTitle;
    cvFileId;
    cvFile;
    projectFileId;
    projectFile;
    status;
};
exports.Evaluation = Evaluation;
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Evaluation.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Evaluation.prototype, "cvFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => upload_entity_1.Upload),
    (0, typeorm_1.JoinColumn)({ name: 'cv_file_id' }),
    __metadata("design:type", upload_entity_1.Upload)
], Evaluation.prototype, "cvFile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Evaluation.prototype, "projectFileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => upload_entity_1.Upload),
    (0, typeorm_1.JoinColumn)({ name: 'project_file_id' }),
    __metadata("design:type", upload_entity_1.Upload)
], Evaluation.prototype, "projectFile", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: evaluation_status_enum_1.EvaluationStatus,
        default: evaluation_status_enum_1.EvaluationStatus.PENDING,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Evaluation.prototype, "status", void 0);
exports.Evaluation = Evaluation = __decorate([
    (0, typeorm_1.Entity)()
], Evaluation);
//# sourceMappingURL=evaluation.entity.js.map