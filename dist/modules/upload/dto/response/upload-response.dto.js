"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadResponseDto = exports.uploadResponseSchema = void 0;
const zod_1 = require("zod");
exports.uploadResponseSchema = zod_1.z.object({
    cvFileId: zod_1.z.uuid(),
    projectFileId: zod_1.z.uuid(),
});
class UploadResponseDto {
    cvFileId;
    projectFileId;
    static from(cvFileId, projectFileId) {
        const dto = new UploadResponseDto();
        dto.cvFileId = cvFileId;
        dto.projectFileId = projectFileId;
        return dto;
    }
}
exports.UploadResponseDto = UploadResponseDto;
//# sourceMappingURL=upload-response.dto.js.map