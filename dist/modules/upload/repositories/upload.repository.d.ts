import { Repository } from 'typeorm';
import { Upload } from '../entities/upload.entity';
export declare class UploadRepository {
    private readonly uploadRepo;
    constructor(uploadRepo: Repository<Upload>);
    create(data: Omit<Upload, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Upload>;
    findById(id: string): Promise<Upload | null>;
    findOrFailById(id: string): Promise<Upload>;
    findByIds(ids: string[]): Promise<Upload[]>;
    getList(page: number, limit: number): Promise<{
        uploads: Upload[];
        totalUploads: number;
    }>;
}
