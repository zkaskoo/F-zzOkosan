import { api } from './api';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadApi = {
  uploadImage: async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResult>('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });

    return response.data;
  },
};
