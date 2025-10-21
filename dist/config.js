"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = exports.chromadbConfig = exports.openaiConfig = exports.cloudinaryConfig = exports.postgresConfig = exports.serverConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.serverConfig = {
    PORT: Number(process.env.SERVER_PORT) || 3000,
    TIMEZONE: process.env.TIMEZONE || 'UTC',
};
exports.postgresConfig = {
    HOST: process.env.POSTGRES_HOST,
    PORT: Number(process.env.POSTGRES_PORT) || 5432,
    DATABASE: process.env.POSTGRES_DATABASE,
    USERNAME: process.env.POSTGRES_USERNAME,
    PASSWORD: process.env.POSTGRES_PASSWORD,
    SYNCHRONIZE: process.env.POSTGRES_SYNCHRONIZE === 'true',
    SSL: process.env.POSTGRES_SSL === 'true',
    SSL_REJECT_UNAUTHORIZED: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true',
    TIMEZONE: process.env.TIMEZONE || 'UTC',
};
exports.cloudinaryConfig = {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FILE_STORAGE_DIRECTORY: process.env.CLOUDINARY_FILE_STORAGE_DIRECTORY,
};
exports.openaiConfig = {
    API_KEY: process.env.OPENAI_API_KEY || 'your_api_key',
    MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    TEMPERATURE: Number(process.env.OPENAI_TEMPERATURE) || 0.3,
    MAX_TOKENS: Number(process.env.OPENAI_MAX_TOKENS) || 1500,
    SUMMARY_TEMPERATURE: Number(process.env.OPENAI_SUMMARY_TEMPERATURE) || 0.5,
    SUMMARY_MAX_TOKENS: Number(process.env.OPENAI_SUMMARY_MAX_TOKENS) || 500,
};
exports.chromadbConfig = {
    API_KEY: process.env.CHROMADB_API_KEY || 'your_api_key',
    TENANT: process.env.CHROMADB_TENANT || 'your_tenant',
    DATABASE: process.env.CHROMADB_DATABASE || 'your_database',
};
exports.redisConfig = {
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
//# sourceMappingURL=config.js.map