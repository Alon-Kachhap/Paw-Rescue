import { prisma } from '@/lib/prisma';
import { getPublicUrl } from '@/lib/utils/r2';

export interface MediaCreateInput {
  url: string;
  fileKey: string;
  fileName?: string;
  fileType?: string;
  size?: number;
  folder?: string;
  userId?: string;
  organizationId?: string;
  animalId?: string;
}

export async function createMedia(data: MediaCreateInput) {
  return await prisma.media.create({
    data
  });
}

export async function getMediaById(id: string) {
  return await prisma.media.findUnique({
    where: { id }
  });
}

export async function getMediaByEntity(entityType: 'animal' | 'organization' | 'user', entityId: string) {
  const query: any = {};
  
  if (entityType === 'animal') {
    query.animalId = entityId;
  } else if (entityType === 'organization') {
    query.organizationId = entityId;
  } else if (entityType === 'user') {
    query.userId = entityId;
  }
  
  return await prisma.media.findMany({
    where: query,
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function deleteMedia(id: string) {
  return await prisma.media.delete({
    where: { id }
  });
}

export async function deleteMediaByFileKey(fileKey: string) {
  return await prisma.media.deleteMany({
    where: { fileKey }
  });
}

export function getImageUrl(fileKeyOrUrl: string) {
  // If it's already a full URL, return it
  if (fileKeyOrUrl.startsWith('http')) {
    return fileKeyOrUrl;
  }
  
  // Otherwise, treat it as a file key and get the public URL
  return getPublicUrl(fileKeyOrUrl);
}