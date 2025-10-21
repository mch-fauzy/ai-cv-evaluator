"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEvaluationDto = exports.createEvaluationSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.createEvaluationSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(1).max(200),
    cvFileId: zod_1.z.uuid(),
    projectFileId: zod_1.z.uuid(),
});
class CreateEvaluationDto extends (0, nestjs_zod_1.createZodDto)(exports.createEvaluationSchema) {
}
exports.CreateEvaluationDto = CreateEvaluationDto;
//# sourceMappingURL=create-evaluation.dto.js.map