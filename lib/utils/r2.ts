import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client for Cloudflare R2
const createS3Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing required R2 environment variables');
    throw new Error('R2 configuration is incomplete. Check environment variables.');
  }
  
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

let s3Client: S3Client;

try {
  s3Client = createS3Client();
} catch (error) {
  console.error('Failed to initialize R2 client:', error);
  // We'll create the client on-demand if initialization fails here
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
}

/**
 * Generate a pre-signed URL for uploading a file directly to R2
 * @param fileType MIME type of the file
 * @param folderPath Optional folder path within the bucket
 */
export async function generatePresignedUploadUrl(fileType: string, folderPath = ''): Promise<{
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}> {
  // Make sure we have an S3 client
  if (!s3Client) {
    s3Client = createS3Client();
  }
  
  // Get bucket name
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  
  if (!bucketName || !publicUrl) {
    throw new Error('R2_BUCKET_NAME or R2_PUBLIC_URL is not defined in environment variables');
  }
  
  // Generate a unique file name
  const fileExtension = fileType.split('/')[1] || '';
  const fileName = `${uuidv4()}${fileExtension ? `.${fileExtension}` : ''}`;
  
  // Construct the file key (path within the bucket)
  const fileKey = folderPath ? `${folderPath}/${fileName}` : fileName;
  
  try {
    // Create PUT command for the file
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: fileType,
    });

    // Generate presigned URL
    const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 }); // 1 hour expiry
    
    // Construct the public URL for the uploaded file
    const fullPublicUrl = `${publicUrl}/${fileKey}`;
    
    return {
      uploadUrl,
      fileKey,
      publicUrl: fullPublicUrl,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Delete a file from R2 bucket
 * @param fileKey The key of the file to delete
 */
export async function deleteFileFromR2(fileKey: string): Promise<boolean> {
  try {
    // Make sure we have an S3 client
    if (!s3Client) {
      s3Client = createS3Client();
    }
    
    const bucketName = process.env.R2_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('R2_BUCKET_NAME is not defined in environment variables');
    }
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    return false;
  }
}

/**
 * Get the public URL for a file in R2
 * @param fileKey The key of the file
 */
export function getPublicUrl(fileKey: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  
  if (!publicUrl) {
    throw new Error('R2_PUBLIC_URL is not defined in environment variables');
  }
  
  return `${publicUrl}/${fileKey}`;
} 