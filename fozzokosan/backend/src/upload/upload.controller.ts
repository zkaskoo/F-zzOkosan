import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fromFile } from 'file-type';
import { unlink, rename } from 'fs/promises';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nincs feltöltött fájl');
    }

    // SA-001: Validate actual file content via magic bytes, not client-supplied MIME
    const detectedType = await fromFile(file.path);

    if (!detectedType || !ALLOWED_MIMES.includes(detectedType.mime)) {
      // Remove the invalid file from disk
      await unlink(file.path).catch(() => {
        /* best-effort cleanup */
      });
      throw new BadRequestException(
        'Csak JPEG, PNG, WebP és GIF képek engedélyezettek',
      );
    }

    // SA-003: Ensure the file extension matches the detected content type
    const correctExt = MIME_TO_EXT[detectedType.mime];
    const baseName = file.filename.replace(/\.[^.]+$/, '');
    const correctFilename = `${baseName}${correctExt}`;

    if (file.filename !== correctFilename) {
      const correctPath = file.path.replace(file.filename, correctFilename);
      await rename(file.path, correctPath);
    }

    return {
      url: this.uploadService.getImageUrl(correctFilename),
      filename: correctFilename,
      size: file.size,
      mimetype: detectedType.mime,
    };
  }
}
