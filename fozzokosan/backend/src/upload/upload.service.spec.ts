import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getImageUrl', () => {
    it('should return a URL path with the given filename', () => {
      const filename = 'abc-123.jpg';
      const result = service.getImageUrl(filename);
      expect(result).toBe('/uploads/abc-123.jpg');
    });

    it('should handle filenames with special characters', () => {
      const filename = 'test-file_2024.png';
      const result = service.getImageUrl(filename);
      expect(result).toBe('/uploads/test-file_2024.png');
    });
  });
});
