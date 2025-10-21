import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EvaluationController } from './controllers/v1/evaluation.controller';
import { Evaluation } from './entities/evaluation.entity';
import { EvaluationRepository } from './repositories/evaluation.repository';
import { EvaluationService } from './services/evaluation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation])],
  controllers: [EvaluationController],
  providers: [EvaluationService, EvaluationRepository],
  exports: [EvaluationService, EvaluationRepository],
})
export class EvaluationModule {}
