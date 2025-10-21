"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultResponseDto = exports.resultResponseSchema = void 0;
const zod_1 = require("zod");
const evaluation_status_enum_1 = require("../../../../common/enums/evaluation-status.enum");
const evaluation_result_dto_1 = require("./evaluation-result.dto");
exports.resultResponseSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    status: zod_1.z.enum(evaluation_status_enum_1.EvaluationStatus),
    result: evaluation_result_dto_1.evaluationResultSchema.nullable(),
});
class ResultResponseDto {
    id;
    status;
    result;
    static fromPending(id, status) {
        const dto = new ResultResponseDto();
        dto.id = id;
        dto.status = status;
        dto.result = null;
        return dto;
    }
    static fromCompleted(id, result) {
        const dto = new ResultResponseDto();
        dto.id = id;
        dto.status = evaluation_status_enum_1.EvaluationStatus.COMPLETED;
        dto.result = result;
        return dto;
    }
    static fromFailed(id) {
        const dto = new ResultResponseDto();
        dto.id = id;
        dto.status = evaluation_status_enum_1.EvaluationStatus.FAILED;
        dto.result = null;
        return dto;
    }
}
exports.ResultResponseDto = ResultResponseDto;
//# sourceMappingURL=result-response.dto.js.map