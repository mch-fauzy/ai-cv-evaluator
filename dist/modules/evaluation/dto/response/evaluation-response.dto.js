"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationResponseDto = exports.evaluationResponseSchema = void 0;
const zod_1 = require("zod");
const evaluation_status_enum_1 = require("../../../../common/enums/evaluation-status.enum");
exports.evaluationResponseSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    status: zod_1.z.enum(evaluation_status_enum_1.EvaluationStatus),
});
class EvaluationResponseDto {
    id;
    status;
    static from(id, status) {
        const dto = new EvaluationResponseDto();
        dto.id = id;
        dto.status = status;
        return dto;
    }
}
exports.EvaluationResponseDto = EvaluationResponseDto;
//# sourceMappingURL=evaluation-response.dto.js.map