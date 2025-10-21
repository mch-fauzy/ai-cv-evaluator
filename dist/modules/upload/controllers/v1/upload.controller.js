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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../../services/upload.service");
const api_response_message_constant_1 = require("../../../../common/constants/api-response-message.constant");
const upload_query_dto_1 = require("../../dto/upload-query.dto");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadFiles(files) {
        const data = await this.uploadService.uploadFiles(files);
        return {
            message: api_response_message_constant_1.API_RESPONSE_MESSAGE.SUCCESS_UPLOAD_DATA('files'),
            data,
        };
    }
    async getList(query) {
        const data = await this.uploadService.getList(query);
        return {
            message: api_response_message_constant_1.API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('uploads'),
            data,
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Upload CV and project files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['cv', 'project'],
            properties: {
                cv: {
                    type: 'string',
                    format: 'binary',
                    description: 'CV file (PDF, max 10MB)',
                },
                project: {
                    type: 'string',
                    format: 'binary',
                    description: 'Project file (PDF, max 10MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Files uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Successfully uploaded files' },
                data: {
                    type: 'object',
                    properties: {
                        cvFileId: {
                            type: 'string',
                            format: 'uuid',
                            example: '550e8400-e29b-41d4-a716-446655440000',
                        },
                        projectFileId: {
                            type: 'string',
                            format: 'uuid',
                            example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad Request - Invalid file type or size',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error - Upload failed',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'cv', maxCount: 1 },
        { name: 'project', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of uploads with pagination' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page (default: 10, max: 100)',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Successfully retrieved upload list',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Successfully retrieved uploads' },
                data: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            properties: {
                                page: { type: 'number', example: 1 },
                                perPage: { type: 'number', example: 10 },
                                total: { type: 'number', example: 50 },
                                totalPage: { type: 'number', example: 5 },
                            },
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', format: 'uuid' },
                                    cloudinaryUrl: { type: 'string' },
                                    fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                                    originalName: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_query_dto_1.UploadQueryDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getList", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('upload'),
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map