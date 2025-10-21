import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import { cloudinaryConfig } from '../../config';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  fileSize: number;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudinaryConfig.CLOUD_NAME,
      api_key: cloudinaryConfig.API_KEY,
      api_secret: cloudinaryConfig.API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    try {
      // Convert the file buffer to a base64-encoded string
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // Upload the file to Cloudinary
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64File,
        {
          folder: `${cloudinaryConfig.FILE_STORAGE_DIRECTORY}/${folder}`,
          resource_type: 'auto',
          filename_override: file.originalname,
          unique_filename: true,
          use_filename: true,
        },
      );

      return {
        publicId: result.public_id,
        url: result.secure_url,
        fileSize: result.bytes,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete file from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
