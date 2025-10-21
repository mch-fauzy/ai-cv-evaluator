import type { EmbeddingFunction } from 'chromadb';
export declare class OpenAIEmbeddingFunction implements EmbeddingFunction {
    private readonly openai;
    private readonly model;
    constructor(apiKey: string, model: string);
    generate(texts: string[]): Promise<number[][]>;
}
