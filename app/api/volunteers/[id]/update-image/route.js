import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createMedia } from "@/lib/services/media-service";

export async function POST(request, { params }) {
  console.log(`POST /api/volunteers/${params.id}/update-image - Request received`);
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    console.error("POST /api/volunteers/[id]/update-image - No session found");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  console.log(`POST /api/volunteers/[id]/update-image - User authenticated: ${session.user.id}`);
  
  const { id } = params;
  
  // Ensure the user is updating their own profile
  if (session.user.id !== id) {
    console.error(`POST /api/volunteers/[id]/update-image - User ID mismatch: ${session.user.id} vs ${id}`);
    return NextResponse.json(
      { error: "You can only update your own profile image" },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { imageUrl, fileKey } = body;
    
    console.log(`POST /api/volunteers/[id]/update-image - Request body:`, {
      imageUrl: imageUrl ? `${imageUrl.substring(0, 20)}...` : null,
      fileKey: fileKey || 'not provided'
    });
    
    // Check if imageUrl is provided or explicitly set to null
    if (imageUrl === undefined) {
      console.error("POST /api/volunteers/[id]/update-image - Image URL not provided");
      return NextResponse.json(
        { error: "Image URL must be provided or set to null" },
        { status: 400 }
      );
    }
    
    // Update the user's profile image
    console.log(`POST /api/volunteers/[id]/update-image - Updating user ${id} with image: ${imageUrl ? 'provided' : 'null'}`);
    const user = await prisma.user.update({
      where: { id },
      data: {
        image: imageUrl
      }
    });
    
    console.log(`POST /api/volunteers/[id]/update-image - User updated successfully`);
    
    // Record the media in the database if fileKey is provided and imageUrl is not null
    if (fileKey && imageUrl) {
      try {
        await createMedia({
          url: imageUrl,
          fileKey,
          folder: 'volunteers',
          userId: id,
          fileName: `profile-${id}`,
          fileType: 'image',
        });
        console.log(`POST /api/volunteers/[id]/update-image - Media record created`);
      } catch (mediaError) {
        console.error("POST /api/volunteers/[id]/update-image - Error creating media record:", mediaError);
        // Continue even if media record creation fails
      }
    }
    
    return NextResponse.json({
      success: true,
      imageUrl: user.image
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
} 