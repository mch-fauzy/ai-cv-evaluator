"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationListItemDto = exports.EvaluationFileDto = void 0;
class EvaluationFileDto {
    id;
    cloudinaryUrl;
    fileType;
    originalName;
    static from(file) {
        const dto = new EvaluationFileDto();
        dto.id = file.id;
        dto.cloudinaryUrl = file.cloudinaryUrl;
        dto.fileType = file.fileType;
        dto.originalName = file.originalName;
        return dto;
    }
}
exports.EvaluationFileDto = EvaluationFileDto;
class EvaluationListItemDto {
    id;
    jobTitle;
    cvFile;
    projectFile;
    status;
    static from(evaluation) {
        if (!evaluation.cvFile || !evaluation.projectFile) {
            throw new Error('Evaluation must include cvFile and projectFile relations');
        }
        const dto = new EvaluationListItemDto();
        dto.id = evaluation.id;
        dto.jobTitle = evaluation.jobTitle;
        dto.cvFile = EvaluationFileDto.from(evaluation.cvFile);
        dto.projectFile = EvaluationFileDto.from(evaluation.projectFile);
        dto.status = evaluation.status;
        return dto;
    }
    static fromList(evaluations) {
        return evaluations.map((evaluation) => this.from(evaluation));
    }
}
exports.EvaluationListItemDto = EvaluationListItemDto;
//# sourceMappingURL=evaluation-list-item.dto.js.map