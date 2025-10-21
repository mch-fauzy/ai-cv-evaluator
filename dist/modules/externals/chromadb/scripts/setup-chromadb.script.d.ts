export declare class ChromaDBSetup {
    private readonly logger;
    private readonly client;
    private readonly collectionName;
    private readonly embeddingFunction;
    constructor();
    run(): Promise<void>;
    private addSampleData;
}
