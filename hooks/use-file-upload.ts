import { useState } from 'react';

interface UseFileUploadProps {
  onUploadComplete?: (url: string, fileKey: string) => void;
  onUploadError?: (error: string) => void;
}

interface UseFileUploadReturn {
  imageUrl: string | null;
  fileKey: string | null;
  isUploading: boolean;
  error: string | null;
  handleUploadComplete: (url: string, key: string) => void;
  handleRemove: () => void;
  reset: () => void;
}

export function useFileUpload({
  onUploadComplete,
  onUploadError,
}: UseFileUploadProps = {}): UseFileUploadReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (url: string, key: string) => {
    setImageUrl(url);
    setFileKey(key);
    setIsUploading(false);
    setError(null);

    if (onUploadComplete) {
      onUploadComplete(url, key);
    }
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setIsUploading(false);
    setError(errorMessage);

    if (onUploadError) {
      onUploadError(errorMessage);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    setFileKey(null);
    setError(null);
  };

  const reset = () => {
    setImageUrl(null);
    setFileKey(null);
    setIsUploading(false);
    setError(null);
  };

  return {
    imageUrl,
    fileKey,
    isUploading,
    error,
    handleUploadComplete,
    handleRemove,
    reset,
  };
} 