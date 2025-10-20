export const chromadbConfig = {
  API_KEY: process.env.CHROMADB_API_KEY,
  TENANT: process.env.CHROMADB_TENANT,
  DATABASE: process.env.CHROMADB_DATABASE || 'ai-cv-evaluator-chroma',
} as const;
