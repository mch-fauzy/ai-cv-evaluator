import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadController } from './controllers/v1/upload.controller';
import { File } from './entities/file.entity';
import { FileRepository } from './repositories/file.repository';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [UploadController],
  providers: [UploadService, FileRepository],
  exports: [UploadService, FileRepository],
})
export class UploadModule {}
