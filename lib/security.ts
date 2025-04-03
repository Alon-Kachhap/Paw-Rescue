import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';

// Password hashing with proper salt rounds
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12); // 12 rounds is secure and reasonably fast
}

// Password verification
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}

// Generate secure random tokens (for password reset, etc.)
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Headers to be set on all API routes
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}; 