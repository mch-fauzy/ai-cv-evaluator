import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Base } from '../../../common/entities/base.entity';
import { EvaluationStatus } from '../../../common/enums/evaluation-status.enum';
import { File } from '../../upload/entities/file.entity';

@Entity()
export class EvaluationJob extends Base {
  @Column({ length: 200 })
  jobTitle!: string;

  @Column({ type: 'uuid' })
  @Index()
  cvFileId!: string;

  @ManyToOne(() => File)
  @JoinColumn({ name: 'cv_file_id' })
  cvFile?: File;

  @Column({ type: 'uuid' })
  @Index()
  reportFileId!: string;

  @ManyToOne(() => File)
  @JoinColumn({ name: 'report_file_id' })
  reportFile?: File;

  @Column({
    type: 'varchar',
    enum: EvaluationStatus,
    default: EvaluationStatus.PENDING,
  })
  @Index()
  status!: EvaluationStatus;
}
