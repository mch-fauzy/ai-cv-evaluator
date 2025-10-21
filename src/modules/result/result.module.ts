import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResultController } from './controllers/v1/result.controller';
import { Result } from './entities/result.entity';
import { ResultRepository } from './repositories/result.repository';
import { ResultService } from './services/result.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  controllers: [ResultController],
  providers: [ResultService, ResultRepository],
  exports: [ResultService, ResultRepository],
})
export class ResultModule {}
