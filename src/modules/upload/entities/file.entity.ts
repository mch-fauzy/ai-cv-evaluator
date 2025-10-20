import { Entity, Column, Index } from 'typeorm';

import { Base } from '../../../common/entities/base.entity';
import { FileType } from '../../../common/enums/file-type.enum';

@Entity()
export class File extends Base {
  @Column()
  cloudinaryPublicId!: string;

  @Column()
  cloudinaryUrl!: string;

  @Column({
    type: 'varchar',
    enum: FileType,
  })
  @Index()
  fileType!: FileType;

  @Column({ type: 'bigint' })
  fileSize!: number;

  @Column()
  originalName!: string;
}
