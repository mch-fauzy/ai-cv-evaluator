"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("../../../../config");
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: config_1.cloudinaryConfig.CLOUD_NAME,
            api_key: config_1.cloudinaryConfig.API_KEY,
            api_secret: config_1.cloudinaryConfig.API_SECRET,
        });
    }
    async uploadFile(file, folder) {
        try {
            const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary_1.v2.uploader.upload(base64File, {
                folder: `${config_1.cloudinaryConfig.FILE_STORAGE_DIRECTORY}/${folder}`,
                resource_type: 'auto',
                filename_override: file.originalname,
                unique_filename: true,
                use_filename: true,
            });
            return {
                publicId: result.public_id,
                url: result.secure_url,
                fileSize: result.bytes,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteFile(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to delete file from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map