"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationResultDto = exports.evaluationResultSchema = void 0;
const zod_1 = require("zod");
exports.evaluationResultSchema = zod_1.z.object({
    cvMatchRate: zod_1.z.number().min(0).max(1),
    cvFeedback: zod_1.z.string(),
    projectScore: zod_1.z.number().min(1).max(5),
    projectFeedback: zod_1.z.string(),
    overallSummary: zod_1.z.string(),
});
class EvaluationResultDto {
    cvMatchRate;
    cvFeedback;
    projectScore;
    projectFeedback;
    overallSummary;
    static from(cvMatchRate, cvFeedback, projectScore, projectFeedback, overallSummary) {
        const dto = new EvaluationResultDto();
        dto.cvMatchRate = cvMatchRate;
        dto.cvFeedback = cvFeedback;
        dto.projectScore = projectScore;
        dto.projectFeedback = projectFeedback;
        dto.overallSummary = overallSummary;
        return dto;
    }
}
exports.EvaluationResultDto = EvaluationResultDto;
//# sourceMappingURL=evaluation-result.dto.js.map