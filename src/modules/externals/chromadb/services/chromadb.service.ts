import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudClient } from 'chromadb';

import {
  CHROMA_COLLECTIONS,
  CHROMA_DEFAULTS,
  CHROMA_DOCUMENT_TYPES,
} from '../../../../common/constants/chromadb.constant';
import { chromadbConfig, openaiConfig } from '../../../../config';
import { OpenAIEmbeddingFunction } from '../utils/chromadb-openai-embedding.util';

/**
 * ChromaDB service for RAG (Retrieval-Augmented Generation)
 * Provides semantic search for job descriptions and case study briefs
 */
@Injectable()
export class ChromaDBService {
  private readonly client: CloudClient;
  private readonly collectionName = CHROMA_COLLECTIONS.evaluationContext;
  private readonly embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    this.client = new CloudClient({
      apiKey: chromadbConfig.API_KEY,
      tenant: chromadbConfig.TENANT,
      database: chromadbConfig.DATABASE,
    });

    // Use OpenAI embeddings (lightweight, no local models)
    this.embeddingFunction = new OpenAIEmbeddingFunction(
      openaiConfig.API_KEY,
      openaiConfig.EMBEDDING_MODEL,
    );
  }

  /**
   * Search for relevant job description context
   * Uses semantic similarity to find matching job requirements
   */
  async searchJobContext(params: {
    jobTitle: string;
    nResults?: number;
  }): Promise<string> {
    try {
      const collection = await this.client.getCollection({
        name: this.collectionName,
        embeddingFunction: this.embeddingFunction,
      });

      const results = await collection.query({
        queryTexts: [params.jobTitle],
        nResults: params.nResults || CHROMA_DEFAULTS.nResults,
        where: {
          type: CHROMA_DOCUMENT_TYPES.jobDescription,
        },
      });

      // Combine retrieved documents into context
      if (results.documents && results.documents[0]) {
        return results.documents[0].join('\n\n');
      }

      return '';
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to search job context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Search for relevant case study/project brief context
   * Uses semantic similarity to find matching project requirements
   */
  async searchCaseStudyContext(params: {
    jobTitle: string;
    nResults?: number;
  }): Promise<string> {
    try {
      const collection = await this.client.getCollection({
        name: this.collectionName,
        embeddingFunction: this.embeddingFunction,
      });

      const results = await collection.query({
        queryTexts: [params.jobTitle],
        nResults: params.nResults || CHROMA_DEFAULTS.nResults,
        where: {
          type: CHROMA_DOCUMENT_TYPES.caseStudy,
        },
      });

      // Combine retrieved documents into context
      if (results.documents && results.documents[0]) {
        return results.documents[0].join('\n\n');
      }

      return '';
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to search case study context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Search for both job and case study context in one call
   * More efficient than making two separate calls
   */
  async searchEvaluationContext(params: {
    jobTitle: string;
    nResults?: number;
  }): Promise<{
    jobContext: string;
    caseStudyContext: string;
  }> {
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
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to search evaluation context: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Add a new job description to the collection
   * For ingestion scripts or admin endpoints
   */
  async addJobDescription(params: {
    id: string;
    title: string;
    content: string;
    metadata?: Record<string, string | number>;
  }): Promise<void> {
    try {
      const collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
      });

      await collection.add({
        ids: [params.id],
        documents: [params.content],
        metadatas: [
          {
            type: CHROMA_DOCUMENT_TYPES.jobDescription,
            title: params.title,
            ...params.metadata,
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to add job description: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Add a new case study to the collection
   * For ingestion scripts or admin endpoints
   */
  async addCaseStudy(params: {
    id: string;
    title: string;
    content: string;
    metadata?: Record<string, string | number>;
  }): Promise<void> {
    try {
      const collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
      });

      await collection.add({
        ids: [params.id],
        documents: [params.content],
        metadatas: [
          {
            type: CHROMA_DOCUMENT_TYPES.caseStudy,
            title: params.title,
            ...params.metadata,
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to add case study: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get collection stats for monitoring
   */
  async getCollectionStats(): Promise<{
    count: number;
    name: string;
  }> {
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
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Check if ChromaDB is healthy/accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.heartbeat();
      return true;
    } catch (error) {
      return false;
    }
  }
}
