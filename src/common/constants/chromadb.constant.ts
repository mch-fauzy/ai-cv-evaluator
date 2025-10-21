/**
 * ChromaDB collection names
 */
export const CHROMA_COLLECTIONS = {
  evaluationContext: 'evaluation_context',
} as const;

/**
 * ChromaDB document types
 */
export const CHROMA_DOCUMENT_TYPES = {
  jobDescription: 'job_description',
  caseStudy: 'case_study',
} as const;

/**
 * ChromaDB query defaults
 */
export const CHROMA_DEFAULTS = {
  nResults: 3, // Number of results to return per query
} as const;
