import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { FileType } from '../../../../common/enums/file-type.enum';
import type { Evaluation } from '../../entities/evaluation.entity';

/**
 * File data DTO for evaluation list
 * Contains simplified file information
 */
export class EvaluationFileDto {
  id!: string;
  cloudinaryUrl!: string;
  fileType!: FileType;
  originalName!: string;

  static from(file: {
    id: string;
    cloudinaryUrl: string;
    fileType: FileType;
    originalName: string;
  }): EvaluationFileDto {
    const dto = new EvaluationFileDto();
    dto.id = file.id;
    dto.cloudinaryUrl = file.cloudinaryUrl;
    dto.fileType = file.fileType;
    dto.originalName = file.originalName;
    return dto;
  }
}

/**
 * Evaluation list item DTO
 * Returns evaluation data with file information for list endpoints
 */
export class EvaluationListItemDto {
  id!: string;
  jobTitle!: string;
  cvFile!: EvaluationFileDto;
  projectFile!: EvaluationFileDto;
  status!: EvaluationStatus;

  static from(evaluation: Evaluation): EvaluationListItemDto {
    if (!evaluation.cvFile || !evaluation.projectFile) {
      throw new Error('Evaluation must include cvFile and projectFile relations');
    }

    const dto = new EvaluationListItemDto();
    dto.id = evaluation.id;
    dto.jobTitle = evaluation.jobTitle;
    dto.cvFile = EvaluationFileDto.from(evaluation.cvFile);
    dto.projectFile = EvaluationFileDto.from(evaluation.projectFile);
    dto.status = evaluation.status;
    return dto;
  }

  static fromList(evaluations: Evaluation[]): EvaluationListItemDto[] {
    return evaluations.map((evaluation) => this.from(evaluation));
  }
}
