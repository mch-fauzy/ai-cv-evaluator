"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("./config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI CV Evaluator API')
        .setDescription('API for evaluating CVs and project reports against job requirements and case study briefs')
        .setVersion('1.0')
        .addTag('upload', 'File upload endpoints')
        .addTag('evaluation', 'Evaluation job endpoints')
        .addTag('results', 'Evaluation result endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const swaggerPath = process.env.NODE_ENV === 'production' ? '' : 'api/docs';
    swagger_1.SwaggerModule.setup(swaggerPath, app, document);
    app.enableCors();
    const port = config_1.serverConfig.PORT;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation: http://localhost:${port}/${swaggerPath}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map