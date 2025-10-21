/**
 * Evaluation job data structure
 * Represents the data passed to the evaluation worker
 */
export interface EvaluationJobData {
  evaluationId: string;
  jobTitle: string;
  cvFileId: string;
  projectFileId: string;
}
