import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserId } from './decorators/user-id.decorator';
import * as bcrypt from 'bcrypt';

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

  getByUsernameOrEmail(usernameOrEmail: string) {
    if (usernameOrEmail.includes('@')) {
      return this.prisma.user.findUnique({
        where: { email: usernameOrEmail },
      });
    }
    return this.prisma.user.findUnique({
      where: { username: usernameOrEmail },
    });
  }

  checkEmailExists(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  checkUsernameExists(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('无效的密码');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hash,
      },
    });
  }

  create({
    username,
    email,
    passwordHash,
    emailVerified,
  }: {
    username?: string;
    email: string;
    passwordHash: string;
    emailVerified?: boolean;
  }) {
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        emailVerified: emailVerified || false,
      },
    });
  }
}
