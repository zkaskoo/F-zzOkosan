import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadApi } from '../../services/uploadApi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Kép feltöltése',
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Csak JPEG, PNG, WebP és GIF képek engedélyezettek';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'A fájl mérete nem lehet nagyobb 5 MB-nál';
    }
    return null;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        const result = await uploadApi.uploadImage(file, setProgress);
        onChange(result.url);
      } catch (err) {
        console.error('[ImageUpload] Upload failed:', err);
        setError('A feltöltés sikertelen. Ellenőrizd a fájl méretét és formátumát.');
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange],
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading && !disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (uploading || disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const handleClick = () => {
    if (!uploading && !disabled) {
      fileInputRef.current?.click();
    }
  };

  // Show preview if we have an image URL
  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
        <div className="relative inline-block rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value}
            alt="Feltöltött kép"
            className="max-h-48 max-w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Kép eltávolítása"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        {label}
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8
          transition-colors cursor-pointer
          ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'}
          ${uploading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
        `}
      >
        {uploading ? (
          <>
            <Upload className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-sm text-text-secondary">Feltöltés...</span>
            <div className="w-full max-w-xs rounded-full bg-gray-200 h-2">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary">{progress}%</span>
          </>
        ) : (
          <>
            <ImageIcon className="h-8 w-8 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              Húzd ide a képet vagy kattints
            </span>
            <span className="text-xs text-text-secondary">
              JPEG, PNG, WebP, GIF (max. 5 MB)
            </span>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
