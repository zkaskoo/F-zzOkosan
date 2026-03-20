import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getImageUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
