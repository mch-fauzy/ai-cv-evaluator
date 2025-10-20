import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../common/entities/base.entity';
import { EvaluationJob } from '../../evaluation/entities/evaluation-job.entity';

@Entity()
export class Evaluation extends Base {
  @Column({ type: 'uuid' })
  @Index({ unique: true })
  jobId!: string;

  @OneToOne(() => EvaluationJob)
  @JoinColumn({ name: 'job_id' })
  job?: EvaluationJob;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cvMatchRate!: number;

  @Column({ type: 'text' })
  cvFeedback!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  projectScore!: number;

  @Column({ type: 'text' })
  projectFeedback!: string;

  @Column({ type: 'text' })
  overallSummary!: string;
}
