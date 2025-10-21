import { config } from 'dotenv';

// Load environment variables once at the application root
config();

/**
 * Server Configuration
 */
export const serverConfig = {
  PORT: Number(process.env.SERVER_PORT) || 3000,
  TIMEZONE: process.env.TIMEZONE || 'UTC',
} as const;

/**
 * PostgreSQL Database Configuration
 */
export const postgresConfig = {
  HOST: process.env.POSTGRES_HOST,
  PORT: Number(process.env.POSTGRES_PORT) || 5432,
  DATABASE: process.env.POSTGRES_DATABASE,
  USERNAME: process.env.POSTGRES_USERNAME,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  SYNCHRONIZE: process.env.POSTGRES_SYNCHRONIZE === 'true',
  SSL: process.env.POSTGRES_SSL === 'true',
  SSL_REJECT_UNAUTHORIZED:
    process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true',
  TIMEZONE: process.env.TIMEZONE || 'UTC',
} as const;

/**
 * Cloudinary Configuration
 */
export const cloudinaryConfig = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  FILE_STORAGE_DIRECTORY: process.env.CLOUDINARY_FILE_STORAGE_DIRECTORY,
} as const;

/**
 * OpenAI Configuration
 */
export const openaiConfig = {
  API_KEY: process.env.OPENAI_API_KEY,
  MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
} as const;

/**
 * ChromaDB Configuration
 */
export const chromadbConfig = {
  API_KEY: process.env.CHROMADB_API_KEY,
  TENANT: process.env.CHROMADB_TENANT,
  DATABASE: process.env.CHROMADB_DATABASE,
} as const;
