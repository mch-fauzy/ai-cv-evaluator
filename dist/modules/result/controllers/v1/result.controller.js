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
exports.ResultController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const result_service_1 = require("../../services/result.service");
const api_response_message_constant_1 = require("../../../../common/constants/api-response-message.constant");
let ResultController = class ResultController {
    resultService;
    constructor(resultService) {
        this.resultService = resultService;
    }
    async getResult(evaluationId) {
        const data = await this.resultService.getResult(evaluationId);
        return {
            message: api_response_message_constant_1.API_RESPONSE_MESSAGE.SUCCESS_GET_DATA('result'),
            data,
        };
    }
};
exports.ResultController = ResultController;
__decorate([
    (0, common_1.Get)(':evaluationId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get evaluation result by evaluation ID',
        description: 'Retrieves the evaluation result for a specific evaluation. Returns status (pending/in_progress/completed/failed) and result details if completed.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'evaluationId',
        description: 'Evaluation ID (UUID format)',
        type: 'string',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Evaluation result retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Successfully retrieved result',
                },
                data: {
                    type: 'object',
                    properties: {
                        evaluationId: {
                            type: 'string',
                            format: 'uuid',
                            example: '550e8400-e29b-41d4-a716-446655440000',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed', 'failed'],
                            example: 'completed',
                        },
                        result: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                cvMatchRate: {
                                    type: 'number',
                                    format: 'float',
                                    example: 0.85,
                                    description: 'CV match rate (0-1)',
                                },
                                cvFeedback: {
                                    type: 'string',
                                    example: 'Strong technical background with 5+ years in backend development. Excellent experience with TypeScript and NestJS.',
                                },
                                projectScore: {
                                    type: 'number',
                                    format: 'float',
                                    example: 4.2,
                                    description: 'Project score (1-5)',
                                },
                                projectFeedback: {
                                    type: 'string',
                                    example: 'Excellent implementation with proper RAG pipeline. Clean TypeScript code following best practices.',
                                },
                                overallSummary: {
                                    type: 'string',
                                    example: 'Strong candidate with excellent technical skills and solid project delivery. Recommended for interview.',
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Evaluation not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
    }),
    __param(0, (0, common_1.Param)('evaluationId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "getResult", null);
exports.ResultController = ResultController = __decorate([
    (0, swagger_1.ApiTags)('results'),
    (0, common_1.Controller)('result'),
    __metadata("design:paramtypes", [result_service_1.ResultService])
], ResultController);
//# sourceMappingURL=result.controller.js.map