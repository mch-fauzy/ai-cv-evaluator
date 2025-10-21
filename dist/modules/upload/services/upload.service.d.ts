import { Paginated } from '../../../common/interfaces/api-response.interface';
import { CloudinaryService } from '../../externals/cloudinary/services/cloudinary.service';
import { UploadQueryDto } from '../dto/upload-query.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
import { UploadListItemDto } from '../dto/response/upload-list-item.dto';
import { UploadRepository } from '../repositories/upload.repository';
export declare class UploadService {
    private readonly cloudinaryService;
    private readonly uploadRepository;
    constructor(cloudinaryService: CloudinaryService, uploadRepository: UploadRepository);
    uploadFiles(files: {
        cv?: Express.Multer.File[];
        project?: Express.Multer.File[];
    }): Promise<UploadResponseDto>;
    getList(query: UploadQueryDto): Promise<Paginated<UploadListItemDto>>;
}
