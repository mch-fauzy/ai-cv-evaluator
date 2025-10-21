import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { UploadModule } from '../upload/upload.module';
import { OpenAIModule } from '../externals/openai/openai.module';
import { ChromaDBModule } from '../externals/chromadb/chromadb.module';
import { EvaluationController } from './controllers/v1/evaluation.controller';
import { Evaluation } from './entities/evaluation.entity';
import { Result } from '../result/entities/result.entity';
import { EvaluationRepository } from './repositories/evaluation.repository';
import { EvaluationService } from './services/evaluation.service';
import { EvaluationQueueService } from './services/evaluation-queue.service';
import { EvaluationWorker } from './workers/evaluation.worker';
import { ResultRepository } from '../result/repositories/result.repository';
import { QUEUE_NAMES } from '../../common/constants/queue.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, Result]),
    BullModule.registerQueue({
      name: QUEUE_NAMES.EVALUATION,
    }),
    UploadModule,
    OpenAIModule,
    ChromaDBModule,
  ],
  controllers: [EvaluationController],
  providers: [
    EvaluationService,
    EvaluationRepository,
    EvaluationQueueService,
    EvaluationWorker,
    ResultRepository,
  ],
  exports: [EvaluationService, EvaluationRepository],
})
export class EvaluationModule {}
