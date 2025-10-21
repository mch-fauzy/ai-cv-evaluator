import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';

import { AppModule } from './app.module';

let cachedApp: Express;

async function createApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

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

  await app.init();

  cachedApp = expressApp;
  return expressApp;
}

export default async (req: Request, res: Response): Promise<void> => {
  const app = await createApp();
  app(req, res);
};
