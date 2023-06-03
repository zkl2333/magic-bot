import { Assistant } from '@prisma/client';

export class CreateAssistantDto
  implements Omit<Assistant, 'id' | 'updatedAt' | 'createdAt' | 'forkedFromId'>
{
  id: number;
  authorId: string;
  name: string;
  description: string;
  avatar: string;
  isPublic: boolean;
  forkedFromId?: number;
  config: string;
  lastSyncAt: Date;
}
