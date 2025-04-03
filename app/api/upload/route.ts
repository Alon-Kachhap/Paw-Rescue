import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/utils/r2';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { createMedia } from '@/lib/services/media-service';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { fileType, folder, fileName, size, organizationId, animalId } = body;

    if (!fileType) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    // Set the folder path based on content type or use default
    const folderPath = folder || 'general';

    // Generate the presigned URL
    const { uploadUrl, fileKey, publicUrl } = await generatePresignedUploadUrl(
      fileType,
      folderPath
    );

    // Store media information in the database
    await createMedia({
      url: publicUrl,
      fileKey,
      fileName: fileName || undefined,
      fileType,
      size: size ? Number(size) : undefined,
      folder: folderPath,
      userId: user.id,
      organizationId: organizationId || undefined,
      animalId: animalId || undefined,
    });

    return NextResponse.json({
      uploadUrl,
      fileKey,
      publicUrl
    });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 