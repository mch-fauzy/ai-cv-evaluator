import { Module } from '@nestjs/common';
import { ResultController } from './controllers/v1/result.controller';
import { ResultService } from './services/result.service';

@Module({
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
