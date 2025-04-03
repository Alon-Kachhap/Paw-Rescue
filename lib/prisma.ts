// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

try {
  // Check if PrismaClient is defined (it's not during build time in some environments)
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // Prevent multiple instances during development
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    prisma = global.prisma;
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  throw new Error(
    'Could not initialize Prisma client. Please ensure you have run "prisma generate" and configured your database URL correctly.'
  );
}

export { prisma };
