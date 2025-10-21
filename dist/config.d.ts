export declare const serverConfig: {
    readonly PORT: number;
    readonly TIMEZONE: string;
};
export declare const postgresConfig: {
    readonly HOST: string | undefined;
    readonly PORT: number;
    readonly DATABASE: string | undefined;
    readonly USERNAME: string | undefined;
    readonly PASSWORD: string | undefined;
    readonly SYNCHRONIZE: boolean;
    readonly SSL: boolean;
    readonly SSL_REJECT_UNAUTHORIZED: boolean;
    readonly TIMEZONE: string;
};
export declare const cloudinaryConfig: {
    readonly CLOUD_NAME: string | undefined;
    readonly API_KEY: string | undefined;
    readonly API_SECRET: string | undefined;
    readonly FILE_STORAGE_DIRECTORY: string | undefined;
};
export declare const openaiConfig: {
    readonly API_KEY: string;
    readonly MODEL: string;
    readonly EMBEDDING_MODEL: string;
    readonly TEMPERATURE: number;
    readonly MAX_TOKENS: number;
    readonly SUMMARY_TEMPERATURE: number;
    readonly SUMMARY_MAX_TOKENS: number;
};
export declare const chromadbConfig: {
    readonly API_KEY: string;
    readonly TENANT: string;
    readonly DATABASE: string;
};
export declare const redisConfig: {
    readonly URL: string;
};
