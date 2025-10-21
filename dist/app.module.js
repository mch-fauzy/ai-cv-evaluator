"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const nestjs_zod_1 = require("nestjs-zod");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const typeorm_postgres_config_1 = require("./database/typeorm-postgres.config");
const evaluation_module_1 = require("./modules/evaluation/evaluation.module");
const health_module_1 = require("./modules/health/health.module");
const result_module_1 = require("./modules/result/result.module");
const upload_module_1 = require("./modules/upload/upload.module");
const config_1 = require("./config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(typeorm_postgres_config_1.typeOrmConfig),
            bull_1.BullModule.forRoot({
                redis: config_1.redisConfig.URL,
            }),
            health_module_1.HealthModule,
            upload_module_1.UploadModule,
            evaluation_module_1.EvaluationModule,
            result_module_1.ResultModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: nestjs_zod_1.ZodValidationPipe,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map