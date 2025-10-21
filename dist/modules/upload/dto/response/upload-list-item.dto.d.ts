import { FileType } from '../../../../common/enums/file-type.enum';
import type { Upload } from '../../entities/upload.entity';
export declare class UploadListItemDto {
    id: string;
    cloudinaryUrl: string;
    fileType: FileType;
    originalName: string;
    static from(upload: Upload): UploadListItemDto;
    static fromList(uploads: Upload[]): UploadListItemDto[];
}
