"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadListItemDto = void 0;
class UploadListItemDto {
    id;
    cloudinaryUrl;
    fileType;
    originalName;
    static from(upload) {
        const dto = new UploadListItemDto();
        dto.id = upload.id;
        dto.cloudinaryUrl = upload.cloudinaryUrl;
        dto.fileType = upload.fileType;
        dto.originalName = upload.originalName;
        return dto;
    }
    static fromList(uploads) {
        return uploads.map((upload) => this.from(upload));
    }
}
exports.UploadListItemDto = UploadListItemDto;
//# sourceMappingURL=upload-list-item.dto.js.map