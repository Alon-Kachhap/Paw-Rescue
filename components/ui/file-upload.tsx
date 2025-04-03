"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onUploadComplete: (url: string, fileKey: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
  value?: string;
  fileKey?: string;
  onRemove?: () => void;
  entityId?: {
    organizationId?: string;
    animalId?: string;
  };
}

export function FileUpload({
  onUploadComplete,
  folder = "general",
  accept = "image/*",
  maxSizeMB = 5,
  className = "",
  buttonText = "Upload File",
  value,
  fileKey,
  onRemove,
  entityId,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [currentFileKey, setCurrentFileKey] = useState<string | null>(fileKey || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeBytes) {
      setUploadError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // First, get a presigned URL from our API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileType: file.type,
          folder,
          fileName: file.name,
          size: file.size,
          ...entityId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { uploadUrl, fileKey, publicUrl } = await response.json();

      // Upload the file directly to R2 using the presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Set preview if it's an image
      if (file.type.startsWith("image/")) {
        setPreviewUrl(publicUrl);
      }
      
      // Store the file key for potential deletion later
      setCurrentFileKey(fileKey);

      // Call the callback with the public URL and file key
      onUploadComplete(publicUrl, fileKey);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (currentFileKey) {
      setIsDeleting(true);
      
      try {
        // Delete the file from R2 and database
        const response = await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileKey: currentFileKey,
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete file");
        }
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setIsDeleting(false);
      }
    }
    
    setPreviewUrl(null);
    setCurrentFileKey(null);
    
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!previewUrl ? (
        <>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-24 border-dashed flex flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-6 w-6" />
                <span>{buttonText}</span>
              </>
            )}
          </Button>
        </>
      ) : (
        <div className="relative border rounded-md overflow-hidden">
          {previewUrl.endsWith(".jpg") || 
           previewUrl.endsWith(".jpeg") || 
           previewUrl.endsWith(".png") || 
           previewUrl.endsWith(".webp") || 
           previewUrl.endsWith(".gif") ? (
            <div className="aspect-video relative">
              <Image
                src={previewUrl}
                alt="Uploaded file"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center aspect-video bg-muted">
              <p className="text-sm text-muted-foreground break-all">
                {previewUrl.split("/").pop()}
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-destructive mt-2">{uploadError}</p>
      )}
    </div>
  );
} 