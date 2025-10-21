import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Upload } from '../entities/upload.entity';

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(Upload) private readonly uploadRepo: Repository<Upload>,
  ) {}

  async create(data: Omit<Upload, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Upload> {
    const upload = this.uploadRepo.create(data);
    return await this.uploadRepo.save(upload);
  }

  async findById(id: string): Promise<Upload | null> {
    return await this.uploadRepo.findOneBy({ id });
  }

  async findOrFailById(id: string): Promise<Upload> {
    const upload = await this.uploadRepo.findOneBy({ id });
    if (!upload) {
      throw new NotFoundException(`Upload with id ${id} not found`);
    }
    return upload;
  }

  async findByIds(ids: string[]): Promise<Upload[]> {
    return await this.uploadRepo.findBy({ id: In(ids) });
  }

  async getList(page: number, limit: number): Promise<{ uploads: Upload[]; totalUploads: number }> {
    const skip = (page - 1) * limit;

    const [uploads, totalUploads] = await this.uploadRepo.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { uploads, totalUploads };
  }
}
