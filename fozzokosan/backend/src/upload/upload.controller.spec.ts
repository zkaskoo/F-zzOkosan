import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should return upload result for a valid file', () => {
      const mockFile = {
        filename: 'abc-123.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
        originalname: 'photo.jpg',
      } as Express.Multer.File;

      const result = controller.uploadImage(mockFile);

      expect(result).toEqual({
        url: '/uploads/abc-123.jpg',
        filename: 'abc-123.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
      });
    });

    it('should throw BadRequestException when no file is provided', () => {
      expect(() =>
        controller.uploadImage(undefined as any),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException with Hungarian message when no file', () => {
      try {
        controller.uploadImage(undefined as any);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).message).toBe(
          'Nincs feltöltött fájl',
        );
      }
    });

    it('should use UploadService to generate the URL', () => {
      const spy = jest.spyOn(uploadService, 'getImageUrl');
      const mockFile = {
        filename: 'test-file.png',
        size: 2048,
        mimetype: 'image/png',
        originalname: 'test.png',
      } as Express.Multer.File;

      controller.uploadImage(mockFile);

      expect(spy).toHaveBeenCalledWith('test-file.png');
    });
  });
});
