import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
}

// In-memory store for rate limiting
// In production, you should use Redis or another external store
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(req: NextRequest, config: RateLimitConfig = { limit: 10, window: 60 }) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = config.window * 1000;
  
  // Get or initialize rate limit data for this IP
  let rateData = rateLimitStore.get(ip);
  if (!rateData) {
    rateData = { count: 0, lastReset: now };
    rateLimitStore.set(ip, rateData);
  }
  
  // Reset count if window has passed
  if (now - rateData.lastReset > windowMs) {
    rateData.count = 0;
    rateData.lastReset = now;
  }
  
  // Increment count
  rateData.count++;
  
  // Check if over limit
  if (rateData.count > config.limit) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': `${config.window}` } }
    );
  }
  
  return null; // Continue with the request
} 