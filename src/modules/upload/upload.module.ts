import { Module } from '@nestjs/common';
import { UploadController } from './controllers/v1/upload.controller';
import { UploadService } from './services/upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
