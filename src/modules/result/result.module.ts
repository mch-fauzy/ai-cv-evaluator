import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultController } from './controllers/v1/result.controller';
import { Result } from './entities/result.entity';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { ResultRepository } from './repositories/result.repository';
import { EvaluationRepository } from '../evaluation/repositories/evaluation.repository';
import { ResultService } from './services/result.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Evaluation])],
  controllers: [ResultController],
  providers: [ResultService, ResultRepository, EvaluationRepository],
  exports: [ResultService, ResultRepository],
})
export class ResultModule {}
