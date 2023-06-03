import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserId } from './decorators/user-id.decorator';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async get(@UserId() userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
      },
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
}
