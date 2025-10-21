import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../common/entities/base.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';

@Entity()
export class Result extends Base {
  @Column({ type: 'uuid' })
  @Index({ unique: true })
  evaluationId!: string;

  @OneToOne(() => Evaluation)
  @JoinColumn({ name: 'evaluation_id' })
  evaluation?: Evaluation;

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
