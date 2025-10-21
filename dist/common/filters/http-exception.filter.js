"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse = {
            message: 'Internal Server Error',
            error: 'An unexpected error occurred',
        };
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                if (Array.isArray(responseObj.message)) {
                    errorResponse = {
                        message: this.getHttpStatusTitle(status),
                        errors: this.formatValidationErrors(responseObj.message),
                    };
                }
                else {
                    errorResponse = {
                        message: this.getHttpStatusTitle(status),
                        error: responseObj.message || exception.message,
                    };
                }
            }
            else {
                errorResponse = {
                    message: this.getHttpStatusTitle(status),
                    error: exception.message,
                };
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
            errorResponse = {
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'production'
                    ? 'An unexpected error occurred'
                    : exception.message,
            };
        }
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} - Status: ${status}`, exception instanceof Error ? exception.stack : exception);
        }
        response.status(status).json(errorResponse);
    }
    getHttpStatusTitle(status) {
        const titles = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Unprocessable Entity',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
        };
        return titles[status] || 'Error';
    }
    formatValidationErrors(messages) {
        const errors = {};
        messages.forEach((msg) => {
            const match = msg.match(/^(\w+)\s+(.+)$/);
            if (match) {
                const [, field, error] = match;
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(error);
            }
            else {
                if (!errors.general) {
                    errors.general = [];
                }
                errors.general.push(msg);
            }
        });
        return errors;
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map