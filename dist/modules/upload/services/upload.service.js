"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const file_type_enum_1 = require("../../../common/enums/file-type.enum");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const cloudinary_service_1 = require("../../externals/cloudinary/services/cloudinary.service");
const upload_response_dto_1 = require("../dto/response/upload-response.dto");
const upload_list_item_dto_1 = require("../dto/response/upload-list-item.dto");
const upload_repository_1 = require("../repositories/upload.repository");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
let UploadService = class UploadService {
    cloudinaryService;
    uploadRepository;
    constructor(cloudinaryService, uploadRepository) {
        this.cloudinaryService = cloudinaryService;
        this.uploadRepository = uploadRepository;
    }
    async uploadFiles(files) {
        if (!files.cv || !files.project) {
            throw new common_1.BadRequestException('Both CV and project files are required');
        }
        const cvFile = files.cv[0];
        const projectFile = files.project[0];
        if (cvFile.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('CV must be a PDF file');
        }
        if (projectFile.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('Project file must be a PDF file');
        }
        if (cvFile.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`CV file size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
        if (projectFile.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`Project file size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
        const cvUploadResult = await this.cloudinaryService.uploadFile(cvFile, 'cv');
        const projectUploadResult = await this.cloudinaryService.uploadFile(projectFile, 'project');
        const cvFileRecord = await this.uploadRepository.create({
            cloudinaryPublicId: cvUploadResult.publicId,
            cloudinaryUrl: cvUploadResult.url,
            fileType: file_type_enum_1.FileType.CV,
            fileSize: cvUploadResult.fileSize,
            originalName: cvFile.originalname,
        });
        const projectFileRecord = await this.uploadRepository.create({
            cloudinaryPublicId: projectUploadResult.publicId,
            cloudinaryUrl: projectUploadResult.url,
            fileType: file_type_enum_1.FileType.PROJECT,
            fileSize: projectUploadResult.fileSize,
            originalName: projectFile.originalname,
        });
        return upload_response_dto_1.UploadResponseDto.from(cvFileRecord.id, projectFileRecord.id);
    }
    async getList(query) {
        const { uploads, totalUploads } = await this.uploadRepository.getList(query.page, query.limit);
        return {
            metadata: pagination_util_1.PaginationUtil.mapMetadata({
                count: totalUploads,
                page: query.page,
                perPage: query.limit,
            }),
            items: upload_list_item_dto_1.UploadListItemDto.fromList(uploads),
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService,
        upload_repository_1.UploadRepository])
], UploadService);
//# sourceMappingURL=upload.service.js.map