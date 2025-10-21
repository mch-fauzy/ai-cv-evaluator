"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = exports.paginationSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const pagination_constant_1 = require("../constants/pagination.constant");
const { DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_UPPER_LIMIT, } = pagination_constant_1.PAGINATION;
const preprocessPaginationSchema = (defaultValue, max) => {
    return zod_1.z.preprocess((val) => {
        const parsed = Number(val);
        return isNaN(parsed) ? defaultValue : parsed;
    }, max ? zod_1.z.number().int().positive().max(max) : zod_1.z.number().int().positive());
};
exports.paginationSchema = zod_1.z.object({
    page: preprocessPaginationSchema(DEFAULT_PAGE),
    limit: preprocessPaginationSchema(DEFAULT_LIMIT, DEFAULT_UPPER_LIMIT),
});
class PaginationDto extends (0, nestjs_zod_1.createZodDto)(exports.paginationSchema) {
}
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=pagination.dto.js.map