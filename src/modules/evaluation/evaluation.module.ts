import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EvaluationController } from './controllers/v1/evaluation.controller';
import { EvaluationJob } from './entities/evaluation-job.entity';
import { EvaluationJobRepository } from './repositories/evaluation-job.repository';
import { EvaluationService } from './services/evaluation.service';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationJob])],
  controllers: [EvaluationController],
  providers: [EvaluationService, EvaluationJobRepository],
  exports: [EvaluationService, EvaluationJobRepository],
})
export class EvaluationModule {}
