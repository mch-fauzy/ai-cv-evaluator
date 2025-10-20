import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
  ) {}

  async create(data: Omit<File, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<File> {
    const file = this.fileRepo.create(data);
    return await this.fileRepo.save(file);
  }

  async findById(id: string): Promise<File | null> {
    return await this.fileRepo.findOneBy({ id });
  }

  async findOrFailById(id: string): Promise<File> {
    const file = await this.fileRepo.findOneBy({ id });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return file;
  }

  async findByIds(ids: string[]): Promise<File[]> {
    return await this.fileRepo.findBy({ id: In(ids) });
  }
}
