import { NextRequest, NextResponse } from 'next/server';
import { checkR2Connectivity } from '@/lib/utils/r2-debug';
import { generatePresignedUploadUrl } from '@/lib/utils/r2';

export async function GET(request: NextRequest) {
  try {
    // Log environment variables (redacted for security)
    console.log('R2 Environment Variables:');
    console.log(`R2_ACCOUNT_ID: ${process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing'}`);
    console.log(`R2_ACCESS_KEY_ID: ${process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing'}`);
    console.log(`R2_SECRET_ACCESS_KEY: ${process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing'}`);
    console.log(`R2_BUCKET_NAME: ${process.env.R2_BUCKET_NAME}`);
    console.log(`R2_PUBLIC_URL: ${process.env.R2_PUBLIC_URL}`);
    
    // Check R2 connectivity
    const connectivityResult = await checkR2Connectivity();
    
    if (!connectivityResult.success) {
      return NextResponse.json({
        ...connectivityResult,
        env: {
          accountId: process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing',
          accessKeyId: process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
          secretKey: process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
          bucketName: process.env.R2_BUCKET_NAME,
          publicUrl: process.env.R2_PUBLIC_URL,
        }
      }, { status: 500 });
    }
    
    // Try to generate a presigned URL
    try {
      console.log('Testing URL generation...');
      const { uploadUrl, fileKey, publicUrl } = await generatePresignedUploadUrl(
        'image/jpeg',
        'test'
      );
      
      return NextResponse.json({
        success: true,
        message: 'R2 test successful',
        connectivity: connectivityResult,
        urlGeneration: {
          success: true,
          uploadUrl,
          fileKey,
          publicUrl
        },
        env: {
          accountId: process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing',
          accessKeyId: process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
          secretKey: process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
          bucketName: process.env.R2_BUCKET_NAME,
          publicUrl: process.env.R2_PUBLIC_URL,
        }
      });
    } catch (error) {
      console.error('Error generating URL:', error);
      return NextResponse.json({
        success: false,
        message: 'R2 connectivity successful but URL generation failed',
        connectivity: connectivityResult,
        urlGeneration: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        },
        env: {
          accountId: process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing',
          accessKeyId: process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
          secretKey: process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
          bucketName: process.env.R2_BUCKET_NAME,
          publicUrl: process.env.R2_PUBLIC_URL,
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('R2 test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'R2 test failed',
      error: error instanceof Error ? error.message : String(error),
      env: {
        accountId: process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Missing',
        accessKeyId: process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
        secretKey: process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
        bucketName: process.env.R2_BUCKET_NAME,
        publicUrl: process.env.R2_PUBLIC_URL,
      }
    }, { status: 500 });
  }
} 