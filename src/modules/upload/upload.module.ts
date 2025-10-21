import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../externals/cloudinary/cloudinary.module';
import { UploadController } from './controllers/v1/upload.controller';
import { Upload } from './entities/upload.entity';
import { UploadRepository } from './repositories/upload.repository';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload]), CloudinaryModule],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadService, UploadRepository],
})
export class UploadModule {}
