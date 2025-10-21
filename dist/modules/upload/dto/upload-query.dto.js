"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadQueryDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
class UploadQueryDto extends (0, nestjs_zod_1.createZodDto)(pagination_dto_1.paginationSchema.extend({})) {
}
exports.UploadQueryDto = UploadQueryDto;
//# sourceMappingURL=upload-query.dto.js.map