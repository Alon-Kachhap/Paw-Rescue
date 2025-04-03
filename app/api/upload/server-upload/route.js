import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { createMedia } from '@/lib/services/media-service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'animals';
    const organizationId = formData.get('organizationId');
    const animalId = formData.get('animalId');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get file details
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = file.size;
    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // Generate a unique file key
    const uuid = crypto.randomUUID();
    const fileExtension = fileName.split('.').pop();
    const fileKey = `${folder}/${uuid}.${fileExtension}`;

    // Upload file to R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileType,
      })
    );

    // Generate public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

    // Store media information in the database
    await createMedia({
      url: publicUrl,
      fileKey,
      fileName,
      fileType,
      size: fileSize,
      folder,
      userId: user.id,
      organizationId: organizationId || undefined,
      animalId: animalId || undefined,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: fileName,
      size: fileSize
    });
  } catch (error) {
    console.error('Server upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}

// Configure the proper body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
}; 