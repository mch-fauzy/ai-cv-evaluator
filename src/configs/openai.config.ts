export const openaiConfig = {
  API_KEY: process.env.OPENAI_API_KEY,
  MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  EMBEDDING_MODEL:
    process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
} as const;
