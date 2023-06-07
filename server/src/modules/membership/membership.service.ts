import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpgradeMembershipDto } from './dto/upgrade-membership.dto';
import { PurchaseMembershipDto } from './dto/purchase-membership.dto';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async purchaseMembership(data: PurchaseMembershipDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException(`用户${data.userId}未找到`);
    }

    const tier = await this.prisma.membershipTier.findUnique({
      where: { id: data.tierId },
    });

    if (!tier) {
      throw new NotFoundException(`会员等级${data.tierId}未找到`);
    }

    const endDate = this.calculateEndDate(data.duration, tier.isMonthly);

    return this.prisma.membership.create({
      data: {
        user: { connect: { id: data.userId } },
        tier: { connect: { id: data.tierId } },
        startDate: new Date(),
        endDate,
      },
    });
  }

  private calculateEndDate(duration: number, isMonthly: boolean): Date {
    const startDate = new Date();
    if (isMonthly) {
      return new Date(
        startDate.getFullYear(),
        startDate.getMonth() + duration,
        startDate.getDate(),
      );
    } else {
      return new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
    }
  }

  async upgradeMembership(data: UpgradeMembershipDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException(`用户${data.userId}未找到`);
    }

    const tier = await this.prisma.membershipTier.findUnique({
      where: { id: data.newTierId },
    });

    if (!tier) {
      throw new NotFoundException(`会员等级${data.newTierId}未找到`);
    }

    const membership = await this.prisma.membership.findFirst({
      where: { userId: data.userId },
      orderBy: { endDate: 'desc' },
    });

    const startDate = membership ? membership.endDate : new Date();
    const endDate = this.calculateEndDate(data.duration, tier.isMonthly);

    return this.prisma.membership.create({
      data: {
        user: { connect: { id: data.userId } },
        tier: { connect: { id: data.newTierId } },
        startDate,
        endDate,
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredMemberships() {
    // 查找所有已经过期的会员
    const expiredMemberships = await this.prisma.membership.findMany({
      where: { endDate: { lt: new Date() } },
    });

    for (const membership of expiredMemberships) {
      // 为每一个过期的会员执行一些动作，比如发送一个通知
      // TODO: 替换为你的通知服务
      // await this.notificationService.sendMembershipExpiredNotification(
      //   membership.userId,
      // );
      console.log(`Membership expired for user ${membership.userId}.`);
    }
  }
}
