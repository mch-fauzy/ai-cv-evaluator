import { Module } from '@nestjs/common';
import { EvaluationController } from './controllers/v1/evaluation.controller';
import { EvaluationService } from './services/evaluation.service';

@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
