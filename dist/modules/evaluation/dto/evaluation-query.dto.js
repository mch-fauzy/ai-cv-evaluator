"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationQueryDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
class EvaluationQueryDto extends (0, nestjs_zod_1.createZodDto)(pagination_dto_1.paginationSchema.extend({})) {
}
exports.EvaluationQueryDto = EvaluationQueryDto;
//# sourceMappingURL=evaluation-query.dto.js.map