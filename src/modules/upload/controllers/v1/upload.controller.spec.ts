import { Test, TestingModule } from '@nestjs/testing';

import { CloudinaryService } from '../../../externals/cloudinary/services/cloudinary.service';
import { UploadRepository } from '../../repositories/upload.repository';
import { UploadService } from '../../services/upload.service';
import { UploadController } from './upload.controller';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockUploadRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findOrFailById: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        UploadService,
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: UploadRepository,
          useValue: mockUploadRepository,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFiles', () => {
    it('should upload files successfully', async () => {
      const mockFiles = {
        cv: [
          {
            fieldname: 'cv',
            originalname: 'test-cv.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test'),
            size: 1000,
          } as Express.Multer.File,
        ],
        project: [
          {
            fieldname: 'project',
            originalname: 'test-project.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test'),
            size: 1000,
          } as Express.Multer.File,
        ],
      };

      const mockCvFileId = '550e8400-e29b-41d4-a716-446655440000';
      const mockProjectFileId = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

      mockCloudinaryService.uploadFile.mockResolvedValueOnce({
        publicId: 'cv/test-cv',
        url: 'https://cloudinary.com/cv/test-cv.pdf',
        fileSize: 1000,
      });

      mockCloudinaryService.uploadFile.mockResolvedValueOnce({
        publicId: 'project/test-project',
        url: 'https://cloudinary.com/project/test-project.pdf',
        fileSize: 1000,
      });

      mockUploadRepository.create
        .mockResolvedValueOnce({ id: mockCvFileId })
        .mockResolvedValueOnce({ id: mockProjectFileId });

      const result = await controller.uploadFiles(mockFiles);

      expect(result).toEqual({
        message: 'Uploaded files successfully',
        data: {
          cvFileId: mockCvFileId,
          projectFileId: mockProjectFileId,
        },
      });
    });

    it('should throw BadRequestException when CV is missing', async () => {
      const mockFiles = {
        project: [
          {
            fieldname: 'project',
            originalname: 'test-project.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test'),
            size: 1000,
          } as Express.Multer.File,
        ],
      };

      await expect(controller.uploadFiles(mockFiles)).rejects.toThrow(
        'Both CV and project files are required',
      );
    });
  });
});
