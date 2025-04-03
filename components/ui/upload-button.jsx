"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

export function UploadButton({ 
  endpoint, 
  onClientUploadComplete, 
  onUploadError,
  className = "", 
  buttonText = "Upload Image"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get a pre-signed URL from the server
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileType: file.type,
          fileName: file.name,
          size: file.size,
          folder: 'animals',
          endpoint: endpoint || 'animalImageUploader'
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await response.json();

      // Step 2: Upload the file directly to the storage using the pre-signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Call the success callback with the public URL
      onClientUploadComplete?.({ 
        url: publicUrl, 
        name: file.name, 
        size: file.size 
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || 'Upload failed');
      onUploadError?.(err);
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="relative">
        <Button
          type="button"
          variant="secondary"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </Button>
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
} 