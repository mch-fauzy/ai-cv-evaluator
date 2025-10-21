"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
class PaginationUtil {
    static mapMetadata(params) {
        const page = params.page;
        const perPage = params.perPage;
        return {
            page: page,
            perPage: perPage,
            total: params.count,
            totalPage: Math.ceil(params.count / perPage),
        };
    }
}
exports.PaginationUtil = PaginationUtil;
//# sourceMappingURL=pagination.util.js.map