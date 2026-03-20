import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

// Mock file-type to avoid real filesystem operations in unit tests
jest.mock('file-type', () => ({
  fromFile: jest.fn(),
}));

// Mock fs/promises to avoid real filesystem operations
jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
  rename: jest.fn().mockResolvedValue(undefined),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fromFile } = require('file-type') as {
  fromFile: jest.Mock;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { unlink } = require('fs/promises') as {
  unlink: jest.Mock;
};

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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should return upload result for a valid JPEG file', async () => {
      fromFile.mockResolvedValue({ ext: 'jpg', mime: 'image/jpeg' });

      const mockFile = {
        filename: 'abc-123.jpg',
        path: '/tmp/uploads/abc-123.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
        originalname: 'photo.jpg',
      } as Express.Multer.File;

      const result = await controller.uploadImage(mockFile);

      expect(result).toEqual({
        url: '/uploads/abc-123.jpg',
        filename: 'abc-123.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
      });
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(
        controller.uploadImage(undefined as unknown as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with Hungarian message when no file', async () => {
      try {
        await controller.uploadImage(
          undefined as unknown as Express.Multer.File,
        );
        fail('Expected BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).message).toBe(
          'Nincs feltöltött fájl',
        );
      }
    });

    it('should use UploadService to generate the URL', async () => {
      fromFile.mockResolvedValue({ ext: 'png', mime: 'image/png' });

      const spy = jest.spyOn(uploadService, 'getImageUrl');
      const mockFile = {
        filename: 'test-file.png',
        path: '/tmp/uploads/test-file.png',
        size: 2048,
        mimetype: 'image/png',
        originalname: 'test.png',
      } as Express.Multer.File;

      await controller.uploadImage(mockFile);

      expect(spy).toHaveBeenCalledWith('test-file.png');
    });

    it('should reject a file with invalid magic bytes', async () => {
      fromFile.mockResolvedValue({
        ext: 'php',
        mime: 'application/x-httpd-php',
      });

      const mockFile = {
        filename: 'malicious.jpg',
        path: '/tmp/uploads/malicious.jpg',
        size: 512,
        mimetype: 'image/jpeg',
        originalname: 'malicious.jpg',
      } as Express.Multer.File;

      await expect(controller.uploadImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(unlink).toHaveBeenCalledWith('/tmp/uploads/malicious.jpg');
    });

    it('should reject a file when file-type returns undefined', async () => {
      fromFile.mockResolvedValue(undefined);

      const mockFile = {
        filename: 'unknown.jpg',
        path: '/tmp/uploads/unknown.jpg',
        size: 256,
        mimetype: 'image/jpeg',
        originalname: 'unknown.jpg',
      } as Express.Multer.File;

      await expect(controller.uploadImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(unlink).toHaveBeenCalledWith('/tmp/uploads/unknown.jpg');
    });
  });
});
