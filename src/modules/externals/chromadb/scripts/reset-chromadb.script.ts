import { CloudClient } from 'chromadb';
import { Logger } from '@nestjs/common';

import { chromadbConfig } from '../../../../config';
import { CHROMA_COLLECTIONS } from '../../../../common/constants/chromadb.constant';

/**
 * Reset script for ChromaDB collection
 * Deletes the existing collection so it can be recreated with correct embedding dimensions
 */
class ChromaDBReset {
  private readonly logger = new Logger(ChromaDBReset.name);
  private readonly client: CloudClient;
  private readonly collectionName = CHROMA_COLLECTIONS.EVALUATION_CONTEXT;

  constructor() {
    this.client = new CloudClient({
      apiKey: chromadbConfig.API_KEY,
      tenant: chromadbConfig.TENANT,
      database: chromadbConfig.DATABASE,
    });
  }

  async run(): Promise<void> {
    try {
      this.logger.log('Starting ChromaDB reset...');

      // Check if collection exists
      const collections = await this.client.listCollections();
      const exists = collections.some(c => c.name === this.collectionName);

      if (exists) {
        this.logger.log(`Deleting collection "${this.collectionName}"...`);
        await this.client.deleteCollection({
          name: this.collectionName,
        });
        this.logger.log('Collection deleted successfully');
      } else {
        this.logger.log(`Collection "${this.collectionName}" does not exist`);
      }

      this.logger.log('ChromaDB reset completed');
      this.logger.log('You can now run "npm run chromadb:setup" to create the collection with correct embeddings');
    } catch (error) {
      this.logger.error('ChromaDB reset failed', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
}

// Execute the reset
const reset = new ChromaDBReset();
reset.run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
