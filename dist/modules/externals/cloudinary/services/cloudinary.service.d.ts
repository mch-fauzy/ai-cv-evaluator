export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
    fileSize: number;
}
export declare class CloudinaryService {
    constructor();
    uploadFile(file: Express.Multer.File, folder: string): Promise<CloudinaryUploadResult>;
    deleteFile(publicId: string): Promise<void>;
}
