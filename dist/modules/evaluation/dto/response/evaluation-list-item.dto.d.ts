import { EvaluationStatus } from '../../../../common/enums/evaluation-status.enum';
import { FileType } from '../../../../common/enums/file-type.enum';
import type { Evaluation } from '../../entities/evaluation.entity';
export declare class EvaluationFileDto {
    id: string;
    cloudinaryUrl: string;
    fileType: FileType;
    originalName: string;
    static from(file: {
        id: string;
        cloudinaryUrl: string;
        fileType: FileType;
        originalName: string;
    }): EvaluationFileDto;
}
export declare class EvaluationListItemDto {
    id: string;
    jobTitle: string;
    cvFile: EvaluationFileDto;
    projectFile: EvaluationFileDto;
    status: EvaluationStatus;
    static from(evaluation: Evaluation): EvaluationListItemDto;
    static fromList(evaluations: Evaluation[]): EvaluationListItemDto[];
}
