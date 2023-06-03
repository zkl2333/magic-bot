import { Injectable, NotFoundException } from '@nestjs/common';
import { Assistant } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';

@Injectable()
export class AssistantsService {
  constructor(private prisma: PrismaService) {}

  async createAssistant(
    userId: string,
    assistantData: CreateAssistantDto,
  ): Promise<Assistant> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const createdAssistant = await this.prisma.assistant.create({
      data: {
        authorId: userId,
        name: assistantData.name,
        description: assistantData.description,
        avatar: assistantData.avatar,
        isPublic: assistantData.isPublic,
        forkedFromId: assistantData.forkedFromId,
        config: JSON.stringify(assistantData.config),
        lastSyncAt: assistantData.lastSyncAt,
      },
    });

    await this.prisma.userAssistant.create({
      data: {
        user: { connect: { id: userId } },
        assistant: { connect: { id: createdAssistant.id } },
      },
    });

    return createdAssistant;
  }

  async forkAssistant(userId: string, assistantId: number): Promise<Assistant> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const assistant = await this.prisma.assistant.findUnique({
      where: { id: assistantId },
    });
    if (!assistant) throw new NotFoundException('Assistant not found');

    const createdAssistant = await this.prisma.assistant.create({
      data: {
        authorId: userId,
        name: assistant.name,
        config: assistant.config,
        description: assistant.description,
        forkedFromId: assistant.id,
        isPublic: false,
      },
    });

    await this.prisma.userAssistant.create({
      data: {
        user: { connect: { id: userId } },
        assistant: { connect: { id: createdAssistant.id } },
      },
    });

    return createdAssistant;
  }

  async listAssistantsByUserId(userId: string): Promise<Assistant[]> {
    return await this.prisma.assistant.findMany({
      include: { forkedFrom: true },
      where: {
        isPublic: false,
        users: { some: { userId: userId } },
      },
    });
  }

  async listPublicAssistants(): Promise<Assistant[]> {
    const assistants = await this.prisma.assistant.findMany({
      include: {
        author: {
          select: { id: true, username: true, nickname: true, avatarUrl: true },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatarUrl: true,
              },
            },
          },
        },
        forkedFrom: true,
      },
      where: { isPublic: true },
    });

    return assistants.map((assistant) => {
      const { users, ...rest } = assistant;
      return {
        ...rest,
        users: users.map((user) => user.user),
      };
    });
  }

  async deleteAssistant(userId: string, assistantId: number): Promise<void> {
    const userAssistant = await this.prisma.userAssistant.findUnique({
      where: { userId_assistantId: { userId, assistantId } },
    });
    if (!userAssistant) throw new NotFoundException('User assistant not found');

    await this.prisma.assistant.delete({ where: { id: assistantId } });
  }

  async getAssistant(
    userId: string,
    assistantId: number,
  ): Promise<Assistant | null> {
    const assistant = await this.prisma.userAssistant.findUnique({
      where: { userId_assistantId: { userId, assistantId } },
      include: {
        assistant: { include: { forkedFrom: true, forks: true } },
      },
    });

    return assistant ? assistant.assistant : null;
  }

  async updateAssistant(
    userId: string,
    assistantId: number,
    assistantData: Partial<Assistant>,
  ): Promise<Assistant | null> {
    const assistant = await this.prisma.userAssistant.findUnique({
      where: { userId_assistantId: { userId, assistantId } },
      include: { assistant: true },
    });

    if (!assistant) throw new NotFoundException('Assistant not found');

    return await this.prisma.assistant.update({
      where: { id: assistantId },
      data: {
        name: assistantData.name,
        description: assistantData.description,
        avatar: assistantData.avatar,
        isPublic: assistantData.isPublic,
        config: JSON.stringify(assistantData.config),
        lastSyncAt: assistantData.lastSyncAt,
      },
    });
  }
}
