/**
 * ChromaDB collection names
 */
export const CHROMA_COLLECTIONS = {
  EVALUATION_CONTEXT: 'evaluation_context',
} as const;

/**
 * ChromaDB document types
 */
export const CHROMA_DOCUMENT_TYPES = {
  JOB_DESCRIPTION: 'job_description',
  CASE_STUDY: 'case_study',
} as const;

/**
 * ChromaDB query defaults
 */
export const CHROMA_DEFAULTS = {
  N_RESULTS: 3, // Number of results to return per query
} as const;
