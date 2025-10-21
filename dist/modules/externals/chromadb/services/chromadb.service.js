"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromaDBService = void 0;
const common_1 = require("@nestjs/common");
const chromadb_1 = require("chromadb");
const chromadb_constant_1 = require("../../../../common/constants/chromadb.constant");
const config_1 = require("../../../../config");
const chromadb_openai_embedding_util_1 = require("../utils/chromadb-openai-embedding.util");
let ChromaDBService = class ChromaDBService {
    client;
    collectionName = chromadb_constant_1.CHROMA_COLLECTIONS.EVALUATION_CONTEXT;
    embeddingFunction;
    constructor() {
        this.client = new chromadb_1.CloudClient({
            apiKey: config_1.chromadbConfig.API_KEY,
            tenant: config_1.chromadbConfig.TENANT,
            database: config_1.chromadbConfig.DATABASE,
        });
        this.embeddingFunction = new chromadb_openai_embedding_util_1.OpenAIEmbeddingFunction(config_1.openaiConfig.API_KEY, config_1.openaiConfig.EMBEDDING_MODEL);
    }
    async searchJobContext(params) {
        try {
            const collection = await this.client.getCollection({
                name: this.collectionName,
                embeddingFunction: this.embeddingFunction,
            });
            const results = await collection.query({
                queryTexts: [params.jobTitle],
                nResults: params.nResults || chromadb_constant_1.CHROMA_DEFAULTS.N_RESULTS,
                where: {
                    type: chromadb_constant_1.CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION,
                },
            });
            if (results.documents && results.documents[0]) {
                return results.documents[0].join('\n\n');
            }
            return '';
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to search job context: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchCaseStudyContext(params) {
        try {
            const collection = await this.client.getCollection({
                name: this.collectionName,
                embeddingFunction: this.embeddingFunction,
            });
            const results = await collection.query({
                queryTexts: [params.jobTitle],
                nResults: params.nResults || chromadb_constant_1.CHROMA_DEFAULTS.N_RESULTS,
                where: {
                    type: chromadb_constant_1.CHROMA_DOCUMENT_TYPES.CASE_STUDY,
                },
            });
            if (results.documents && results.documents[0]) {
                return results.documents[0].join('\n\n');
            }
            return '';
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to search case study context: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async searchEvaluationContext(params) {
        try {
            const [jobContext, caseStudyContext] = await Promise.all([
                this.searchJobContext({
                    jobTitle: params.jobTitle,
                    nResults: params.nResults,
                }),
                this.searchCaseStudyContext({
                    jobTitle: params.jobTitle,
                    nResults: params.nResults,
                }),
            ]);
            return {
                jobContext,
                caseStudyContext,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to search evaluation context: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addJobDescription(params) {
        try {
            const collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
            });
            await collection.add({
                ids: [params.id],
                documents: [params.content],
                metadatas: [
                    {
                        type: chromadb_constant_1.CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION,
                        title: params.title,
                        ...params.metadata,
                    },
                ],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to add job description: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async addCaseStudy(params) {
        try {
            const collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
            });
            await collection.add({
                ids: [params.id],
                documents: [params.content],
                metadatas: [
                    {
                        type: chromadb_constant_1.CHROMA_DOCUMENT_TYPES.CASE_STUDY,
                        title: params.title,
                        ...params.metadata,
                    },
                ],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to add case study: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getCollectionStats() {
        try {
            const collection = await this.client.getCollection({
                name: this.collectionName,
                embeddingFunction: this.embeddingFunction,
            });
            const count = await collection.count();
            return {
                name: this.collectionName,
                count,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to get collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async healthCheck() {
        try {
            await this.client.heartbeat();
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.ChromaDBService = ChromaDBService;
exports.ChromaDBService = ChromaDBService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChromaDBService);
//# sourceMappingURL=chromadb.service.js.map