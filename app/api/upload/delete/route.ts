import { NextRequest, NextResponse } from 'next/server';
import { deleteFileFromR2 } from '@/lib/utils/r2';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { deleteMediaByFileKey } from '@/lib/services/media-service';

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
    const { fileKey } = body;

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Delete the file from R2
    const deleted = await deleteFileFromR2(fileKey);
    
    // Delete the file reference from the database
    await deleteMediaByFileKey(fileKey);

    return NextResponse.json({
      success: deleted,
      message: deleted ? 'File deleted successfully' : 'File may not have been deleted from storage'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 