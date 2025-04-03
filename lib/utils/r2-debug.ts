import { S3Client, ListBucketsCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

// Function to check R2 connectivity
export async function checkR2Connectivity() {
  try {
    console.log('Starting R2 connectivity check...');
    console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID);
    console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
    console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);
    
    // Initialize S3 client for Cloudflare R2
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
    
    // Try to list buckets to check authentication
    console.log('Attempting to list buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResult = await s3Client.send(listCommand);
    console.log('Buckets found:', listResult.Buckets?.length || 0);
    
    // Try to check if the specific bucket exists
    console.log(`Checking if bucket '${process.env.R2_BUCKET_NAME}' exists...`);
    const headCommand = new HeadBucketCommand({
      Bucket: process.env.R2_BUCKET_NAME,
    });
    
    try {
      await s3Client.send(headCommand);
      console.log('Bucket exists and is accessible');
      return {
        success: true,
        message: 'R2 connectivity check successful'
      };
    } catch (error) {
      console.error('Error checking bucket:', error);
      return {
        success: false,
        message: 'Failed to access bucket',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } catch (error) {
    console.error('R2 connectivity check failed:', error);
    return {
      success: false,
      message: 'R2 connectivity check failed',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 