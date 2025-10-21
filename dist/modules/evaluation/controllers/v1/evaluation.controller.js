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
exports.EvaluationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_message_constant_1 = require("../../../../common/constants/api-response-message.constant");
const create_evaluation_dto_1 = require("../../dto/request/create-evaluation.dto");
const evaluation_service_1 = require("../../services/evaluation.service");
const evaluation_query_dto_1 = require("../../dto/evaluation-query.dto");
let EvaluationController = class EvaluationController {
    evaluationService;
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    async createEvaluation(data) {
        const response = await this.evaluationService.createEvaluation(data);
        return {
            message: api_response_message_constant_1.API_RESPONSE_MESSAGE.SUCCESS_CREATE_DATA('evaluation job'),
            data: response,
        };
    }
    async getList(query) {
        const data = await this.evaluationService.getList(query);
        return {
            message: api_response_message_constant_1.API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('evaluations'),
            data,
        };
    }
};
exports.EvaluationController = EvaluationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Create evaluation job' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Evaluation job created successfully',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Successfully created evaluation job',
                },
                data: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '550e8400-e29b-41d4-a716-446655440000',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed', 'failed'],
                            example: 'pending',
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad Request - Invalid data or files not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_evaluation_dto_1.CreateEvaluationDto]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "createEvaluation", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of evaluations with pagination' }),
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
        description: 'Successfully retrieved evaluation list',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Successfully retrieved evaluations' },
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
                                    jobTitle: { type: 'string' },
                                    cvFile: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', format: 'uuid' },
                                            cloudinaryUrl: { type: 'string' },
                                            fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                                            originalName: { type: 'string' },
                                        },
                                    },
                                    projectFile: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', format: 'uuid' },
                                            cloudinaryUrl: { type: 'string' },
                                            fileType: { type: 'string', enum: ['CV', 'PROJECT'] },
                                            originalName: { type: 'string' },
                                        },
                                    },
                                    status: {
                                        type: 'string',
                                        enum: ['pending', 'in_progress', 'completed', 'failed'],
                                    },
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
    __metadata("design:paramtypes", [evaluation_query_dto_1.EvaluationQueryDto]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getList", null);
exports.EvaluationController = EvaluationController = __decorate([
    (0, swagger_1.ApiTags)('evaluation'),
    (0, common_1.Controller)('evaluate'),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService])
], EvaluationController);
//# sourceMappingURL=evaluation.controller.js.map