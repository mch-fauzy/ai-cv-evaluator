export declare class ChromaDBService {
    private readonly client;
    private readonly collectionName;
    private readonly embeddingFunction;
    constructor();
    searchJobContext(params: {
        jobTitle: string;
        nResults?: number;
    }): Promise<string>;
    searchCaseStudyContext(params: {
        jobTitle: string;
        nResults?: number;
    }): Promise<string>;
    searchEvaluationContext(params: {
        jobTitle: string;
        nResults?: number;
    }): Promise<{
        jobContext: string;
        caseStudyContext: string;
    }>;
    addJobDescription(params: {
        id: string;
        title: string;
        content: string;
        metadata?: Record<string, string | number>;
    }): Promise<void>;
    addCaseStudy(params: {
        id: string;
        title: string;
        content: string;
        metadata?: Record<string, string | number>;
    }): Promise<void>;
    getCollectionStats(): Promise<{
        count: number;
        name: string;
    }>;
    healthCheck(): Promise<boolean>;
}
