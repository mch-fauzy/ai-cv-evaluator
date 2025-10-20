import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

// Load environment variables
config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('AI CV Evaluator API')
    .setDescription(
      'API for evaluating CVs and project reports against job requirements and case study briefs',
    )
    .setVersion('1.0')
    .addTag('upload', 'File upload endpoints')
    .addTag('evaluation', 'Evaluation job endpoints')
    .addTag('results', 'Evaluation result endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS for frontend integration
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

void bootstrap();
