import type { UploadResponseDto } from '../../dto/response/upload-response.dto';
import { UploadService } from '../../services/upload.service';
import type { ApiResult, Paginated } from '../../../../common/interfaces/api-response.interface';
import { UploadQueryDto } from '../../dto/upload-query.dto';
import type { UploadListItemDto } from '../../dto/response/upload-list-item.dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFiles(files: {
        cv?: Express.Multer.File[];
        project?: Express.Multer.File[];
    }): Promise<ApiResult<UploadResponseDto>>;
    getList(query: UploadQueryDto): Promise<ApiResult<Paginated<UploadListItemDto>>>;
}
