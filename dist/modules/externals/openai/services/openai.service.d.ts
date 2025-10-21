export declare class OpenAIService {
    private readonly client;
    constructor();
    evaluateCV(params: {
        cvText: string;
        jobTitle: string;
        jobContext: string;
    }): Promise<{
        matchRate: number;
        feedback: string;
    }>;
    scoreProject(params: {
        projectText: string;
        jobTitle: string;
        caseStudyContext: string;
    }): Promise<{
        score: number;
        feedback: string;
    }>;
    generateSummary(params: {
        cvMatchRate: number;
        cvFeedback: string;
        projectScore: number;
        projectFeedback: string;
        jobTitle: string;
    }): Promise<string>;
    private buildCVEvaluationPrompt;
    private buildProjectScoringPrompt;
    private buildSummaryPrompt;
    private parseCVEvaluationResponse;
    private parseProjectScoringResponse;
}
