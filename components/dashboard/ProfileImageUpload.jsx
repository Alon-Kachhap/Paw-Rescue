"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { UserCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfileImageUpload({ userId, currentImage, className = "", size = "large" }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(currentImage);
  const [showUploader, setShowUploader] = useState(false);

  // Determine dimensions based on size prop
  const dimensions = {
    small: { width: 40, height: 40, iconSize: "h-5 w-5" },
    medium: { width: 60, height: 60, iconSize: "h-6 w-6" },
    large: { width: 96, height: 96, iconSize: "h-8 w-8" },
    xl: { width: 120, height: 120, iconSize: "h-10 w-10" },
  }[size] || { width: 96, height: 96, iconSize: "h-8 w-8" };

  const handleImageUploadComplete = async (url, fileKey) => {
    try {
      setIsUploading(true);
      
      const response = await fetch(`/api/volunteers/${userId}/update-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: url,
          fileKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile image");
      }

      setProfileImage(url);
      setShowUploader(false);
      toast.success("Profile image updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error(error.message || "Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      
      const response = await fetch(`/api/volunteers/${userId}/update-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove profile image");
      }

      setProfileImage(null);
      setShowUploader(false);
      toast.success("Profile image removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error(error.message || "Failed to remove profile image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Profile image display */}
      <div 
        className={`relative rounded-full overflow-hidden bg-primary/10 border-4 border-background`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {profileImage ? (
          <Image 
            src={profileImage}
            alt="Profile"
            width={dimensions.width}
            height={dimensions.height}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <UserCircle className={`${dimensions.iconSize} text-primary`} />
          </div>
        )}
        
        {/* Edit button overlay */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
          onClick={() => setShowUploader(!showUploader)}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Image upload dialog */}
      {showUploader && (
        <div className="absolute top-full mt-2 p-4 bg-background rounded-lg shadow-lg border z-10 min-w-[250px]">
          <FileUpload
            folder="volunteers"
            buttonText="Upload Profile Picture"
            accept="image/*"
            maxSizeMB={2}
            onUploadComplete={handleImageUploadComplete}
            value={profileImage}
            onRemove={handleRemoveImage}
            entityId={{ userId }}
          />
        </div>
      )}
    </div>
  );
} 