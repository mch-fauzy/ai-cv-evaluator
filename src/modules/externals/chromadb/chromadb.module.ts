import { Module } from '@nestjs/common';

import { ChromaDBService } from './services/chromadb.service';

@Module({
  providers: [ChromaDBService],
  exports: [ChromaDBService],
})
export class ChromaDBModule {}
