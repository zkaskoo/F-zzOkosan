import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const ALLOWED_MIMES = Object.keys(MIME_TO_EXT);

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          // SA-003: Derive extension from validated MIME type, never from originalname
          const ext = MIME_TO_EXT[file.mimetype] ?? '.bin';
          const uniqueName = `${randomUUID()}${ext}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        // First-pass defence: reject obviously wrong MIME types.
        // Real validation of magic bytes happens in the controller after upload.
        if (ALLOWED_MIMES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Csak JPEG, PNG, WebP es GIF kepek engedelyezettek'),
            false,
          );
        }
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
