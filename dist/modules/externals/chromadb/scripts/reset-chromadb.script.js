"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chromadb_1 = require("chromadb");
const common_1 = require("@nestjs/common");
const config_1 = require("../../../../config");
const chromadb_constant_1 = require("../../../../common/constants/chromadb.constant");
class ChromaDBReset {
    logger = new common_1.Logger(ChromaDBReset.name);
    client;
    collectionName = chromadb_constant_1.CHROMA_COLLECTIONS.EVALUATION_CONTEXT;
    constructor() {
        this.client = new chromadb_1.CloudClient({
            apiKey: config_1.chromadbConfig.API_KEY,
            tenant: config_1.chromadbConfig.TENANT,
            database: config_1.chromadbConfig.DATABASE,
        });
    }
    async run() {
        try {
            this.logger.log('Starting ChromaDB reset...');
            const collections = await this.client.listCollections();
            const exists = collections.some(c => c.name === this.collectionName);
            if (exists) {
                this.logger.log(`Deleting collection "${this.collectionName}"...`);
                await this.client.deleteCollection({
                    name: this.collectionName,
                });
                this.logger.log('Collection deleted successfully');
            }
            else {
                this.logger.log(`Collection "${this.collectionName}" does not exist`);
            }
            this.logger.log('ChromaDB reset completed');
            this.logger.log('You can now run "npm run chromadb:setup" to create the collection with correct embeddings');
        }
        catch (error) {
            this.logger.error('ChromaDB reset failed', error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
}
const reset = new ChromaDBReset();
reset.run()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
//# sourceMappingURL=reset-chromadb.script.js.map