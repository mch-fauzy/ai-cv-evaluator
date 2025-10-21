import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../common/entities/base.entity';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { Upload } from '../../upload/entities/upload.entity';

@Entity()
export class Evaluation extends Base {
  @Column({ length: 200 })
  jobTitle!: string;

  @Column({ type: 'uuid' })
  @Index()
  cvFileId!: string;

  @ManyToOne(() => Upload)
  @JoinColumn({ name: 'cv_file_id' })
  cvFile?: Upload;

  @Column({ type: 'uuid' })
  @Index()
  projectFileId!: string;

  @ManyToOne(() => Upload)
  @JoinColumn({ name: 'project_file_id' })
  projectFile?: Upload;

  @Column({
    type: 'varchar',
    enum: EvaluationStatus,
    default: EvaluationStatus.PENDING,
  })
  @Index()
  status!: EvaluationStatus;
}
