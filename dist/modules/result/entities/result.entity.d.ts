import { Base } from '../../../common/entities/base.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
export declare class Result extends Base {
    evaluationId: string;
    evaluation?: Evaluation;
    cvMatchRate: number;
    cvFeedback: string;
    projectScore: number;
    projectFeedback: string;
    overallSummary: string;
}
