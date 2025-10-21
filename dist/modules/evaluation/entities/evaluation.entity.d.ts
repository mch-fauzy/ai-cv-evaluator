import { Base } from '../../../common/entities/base.entity';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { Upload } from '../../upload/entities/upload.entity';
export declare class Evaluation extends Base {
    jobTitle: string;
    cvFileId: string;
    cvFile?: Upload;
    projectFileId: string;
    projectFile?: Upload;
    status: EvaluationStatus;
}
