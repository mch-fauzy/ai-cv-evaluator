import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Index,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  createdBy?: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string | null;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  deletedBy?: string | null;
}
