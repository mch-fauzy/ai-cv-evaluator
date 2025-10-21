import { Base } from '../../../common/entities/base.entity';
import { FileType } from '../../../common/enums/file-type.enum';
export declare class Upload extends Base {
    cloudinaryPublicId: string;
    cloudinaryUrl: string;
    fileType: FileType;
    fileSize: number;
    originalName: string;
}
