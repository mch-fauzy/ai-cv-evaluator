export declare const QUEUE_NAMES: {
    readonly EVALUATION: "evaluation";
};
export declare const JOB_NAMES: {
    readonly PROCESS_EVALUATION: "process-evaluation";
};
export declare const QUEUE_OPTIONS: {
    readonly defaultJobOptions: {
        readonly attempts: 3;
        readonly backoff: {
            readonly type: "exponential";
            readonly delay: 2000;
        };
        readonly removeOnComplete: {
            readonly count: 100;
            readonly age: number;
        };
        readonly removeOnFail: {
            readonly count: 500;
            readonly age: number;
        };
    };
};
