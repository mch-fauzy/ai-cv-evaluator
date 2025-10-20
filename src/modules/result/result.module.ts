import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultController } from './controllers/v1/result.controller';
import { Evaluation } from './entities/evaluation.entity';
import { EvaluationRepository } from './repositories/evaluation.repository';
import { ResultService } from './services/result.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation])],
  controllers: [ResultController],
  providers: [ResultService, EvaluationRepository],
  exports: [ResultService, EvaluationRepository],
})
export class ResultModule {}
