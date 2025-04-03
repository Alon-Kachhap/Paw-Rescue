import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Apply CORS headers only to API routes
  if (pathname.startsWith('/api/')) {
    // Check origin
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [
      process.env.NEXTAUTH_URL || '',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Set CORS headers for all API responses
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Origin', 
      allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 