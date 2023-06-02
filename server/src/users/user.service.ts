import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async get(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...result } = user;
    return result;
  }

  getByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async getAssistants(id: string) {
    const assistant = await this.prisma.assistant.findMany({
      include: {
        forkedFrom: true,
      },
      where: {
        isPublic: false,
        users: {
          some: {
            userId: id,
          },
        },
      },
    });
    return assistant;
  }
}
