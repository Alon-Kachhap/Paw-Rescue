"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle, Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfileImageUploadFix({ userId, currentImage, className = "", size = "large" }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(currentImage);
  const [showUploader, setShowUploader] = useState(false);
  const fileInputRef = useRef(null);
  
  // Debug logs when component mounts
  useEffect(() => {
    console.log("ProfileImageUploadFix mounted with:", { 
      userId, 
      currentImage: currentImage ? `${currentImage.substring(0, 20)}...` : 'none',
      size 
    });
  }, [userId, currentImage, size]);
  
  // Log when profileImage changes
  useEffect(() => {
    console.log("ProfileImage state changed:", 
      profileImage ? `${profileImage.substring(0, 20)}...` : 'none'
    );
  }, [profileImage]);

  // Determine dimensions based on size prop
  const dimensions = {
    small: { width: 40, height: 40, iconSize: "h-5 w-5" },
    medium: { width: 60, height: 60, iconSize: "h-6 w-6" },
    large: { width: 96, height: 96, iconSize: "h-8 w-8" },
    xl: { width: 120, height: 120, iconSize: "h-10 w-10" },
  }[size] || { width: 96, height: 96, iconSize: "h-8 w-8" };

  const handleFileChange = async (e) => {
    console.log("File selection event triggered");
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      toast.error("Please select an image file");
      return;
    }

    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      console.error("File too large:", file.size);
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);
    console.log("Starting upload process...");

    try {
      // Use the FormData API for a more reliable upload approach
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('folder', 'volunteers');
      
      console.log("FormData prepared:", {
        hasFile: !!formData.get('file'),
        userId: formData.get('userId'),
        folder: formData.get('folder')
      });

      // Upload the file to your server
      console.log("Sending file to /api/upload/direct...");
      const uploadResponse = await fetch("/api/upload/direct", {
        method: "POST",
        body: formData,
      });
      
      console.log("Upload response status:", uploadResponse.status);

      if (!uploadResponse.ok) {
        console.error("Upload failed with status:", uploadResponse.status);
        let errorData;
        try {
          errorData = await uploadResponse.json();
          console.error("Error details:", errorData);
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorData?.error || "Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload successful, received data:", {
        success: uploadData.success,
        imageUrl: uploadData.imageUrl ? `${uploadData.imageUrl.substring(0, 20)}...` : 'none',
        fileKey: uploadData.fileKey
      });
      
      const { imageUrl } = uploadData;

      // Update user profile with the new image URL
      console.log(`Updating user profile (${userId}) with new image URL...`);
      const updateResponse = await fetch(`/api/volunteers/${userId}/update-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });
      
      console.log("Profile update response status:", updateResponse.status);

      if (!updateResponse.ok) {
        console.error("Profile update failed:", updateResponse.status);
        let errorData;
        try {
          errorData = await updateResponse.json();
          console.error("Error details:", errorData);
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error("Failed to update profile image");
      }

      console.log("Profile image updated successfully!");
      setProfileImage(imageUrl);
      setShowUploader(false);
      toast.success("Profile image updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error in profile image update process:", error);
      toast.error(error.message || "Failed to upload profile image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log("Upload process completed");
    }
  };

  const handleRemoveImage = async () => {
    if (!profileImage) {
      console.log("No profile image to remove");
      return;
    }

    console.log("Starting image removal process...");
    try {
      setIsUploading(true);
      
      console.log(`Sending request to remove profile image for user ${userId}...`);
      const response = await fetch(`/api/volunteers/${userId}/update-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: null,
        }),
      });
      
      console.log("Remove image response status:", response.status);

      // Parse the response data first
      let responseData;
      try {
        responseData = await response.json();
        console.log("Response data:", responseData);
      } catch (e) {
        // If the response isn't valid JSON, handle accordingly
        console.error("Invalid JSON response:", e);
      }

      if (!response.ok) {
        console.error("Failed to remove profile image:", response.status);
        throw new Error(
          responseData?.error || "Failed to remove profile image"
        );
      }

      console.log("Profile image removed successfully");
      setProfileImage(null);
      setShowUploader(false);
      toast.success("Profile image removed successfully");
      router.refresh();
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error(error.message || "Failed to remove profile image");
    } finally {
      setIsUploading(false);
      console.log("Image removal process completed");
    }
  };
  
  // Simple file upload input instead of using the R2 presigned URL approach
  const renderUploader = () => (
    <div className="p-4 bg-background rounded-lg shadow-lg border z-10 min-w-[250px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90
              cursor-pointer"
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">Max size: 2MB</p>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowUploader(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          
          {profileImage && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

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
            onError={(e) => {
              console.error("Failed to load profile image:", profileImage);
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${userId}&size=${dimensions.width}`;
            }}
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
          onClick={() => {
            console.log("Image uploader toggle:", !showUploader);
            setShowUploader(!showUploader);
          }}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Image upload dialog */}
      {showUploader && (
        <div className="absolute top-full mt-2 min-w-[250px] z-10">
          {renderUploader()}
        </div>
      )}
    </div>
  );
} 