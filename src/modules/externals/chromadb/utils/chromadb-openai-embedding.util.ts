import type { EmbeddingFunction } from 'chromadb';
import OpenAI from 'openai';

/**
 * OpenAI Embedding Function for ChromaDB
 * Uses OpenAI API to generate embeddings (lightweight, no local models)
 */
export class OpenAIEmbeddingFunction implements EmbeddingFunction {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  async generate(texts: string[]): Promise<number[][]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  }
}
