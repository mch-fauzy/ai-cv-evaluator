import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { HealthModule } from './modules/health/health.module';
import { ResultModule } from './modules/result/result.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [HealthModule, UploadModule, EvaluationModule, ResultModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
