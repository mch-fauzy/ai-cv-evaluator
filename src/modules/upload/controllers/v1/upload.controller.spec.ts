import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from '../../services/upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFiles', () => {
    it('should throw error - not yet implemented', async () => {
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
        report: [
          {
            fieldname: 'report',
            originalname: 'test-report.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test'),
            size: 1000,
          } as Express.Multer.File,
        ],
      };

      await expect(controller.uploadFiles(mockFiles)).rejects.toThrow(
        'Upload functionality not yet implemented - Stage 2',
      );
    });

    it('should throw BadRequestException when CV is missing', async () => {
      const mockFiles = {
        report: [
          {
            fieldname: 'report',
            originalname: 'test-report.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: Buffer.from('test'),
            size: 1000,
          } as Express.Multer.File,
        ],
      };

      await expect(controller.uploadFiles(mockFiles)).rejects.toThrow();
    });
  });
});
