import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createMedia } from '@/lib/services/media-service';
import { v4 as uuidv4 } from 'uuid';

// Create S3 client for direct uploads
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  console.log("POST /api/upload/direct - Request received");
  
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      console.error("POST /api/upload/direct - No user found");
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log("POST /api/upload/direct - User authenticated:", user.id);

    // Get FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const folder = formData.get('folder') as string || 'volunteers';
    
    console.log("POST /api/upload/direct - Request details:", {
      fileProvided: !!file,
      fileType: file?.type,
      fileSize: file?.size,
      userId: userId || 'not provided',
      folder: folder
    });
    
    // Validate user ID
    if (userId && userId !== user.id) {
      console.error(`POST /api/upload/direct - User ID mismatch: ${userId} vs ${user.id}`);
      return NextResponse.json(
        { error: 'You can only upload files for your own account' },
        { status: 403 }
      );
    }

    if (!file) {
      console.error("POST /api/upload/direct - No file provided");
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique file name
    const fileExtension = file.type.split('/')[1] || '';
    const fileName = `${uuidv4()}${fileExtension ? `.${fileExtension}` : ''}`;
    
    // Use the provided folder or default to volunteers
    const folderPath = folder || 'volunteers';
    
    // Construct the file key (path within the bucket)
    const fileKey = `${folderPath}/${fileName}`;
    
    console.log(`POST /api/upload/direct - Preparing to upload to ${fileKey}`);
    
    // Get file data as arrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to R2 directly from the server
    try {
      console.log("POST /api/upload/direct - Uploading to R2", {
        bucketName: process.env.R2_BUCKET_NAME,
        fileKey,
        contentType: file.type,
        bufferSize: fileBuffer.byteLength
      });
      
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
      });
      
      await s3Client.send(command);
      
      // Construct the public URL
      const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;
      
      console.log(`POST /api/upload/direct - Upload successful, URL: ${imageUrl}`);
      
      // Record the media in the database
      try {
        await createMedia({
          url: imageUrl,
          fileKey,
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          folder: folderPath,
          userId: user.id,
        });
        console.log("POST /api/upload/direct - Media record created in database");
      } catch (mediaError) {
        console.error("POST /api/upload/direct - Error creating media record:", mediaError);
        // Continue even if media record creation fails
      }
      
      return NextResponse.json({
        success: true,
        imageUrl,
        fileKey
      });
    } catch (uploadError) {
      console.error('R2 upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload to R2 storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 