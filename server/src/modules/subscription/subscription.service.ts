import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { DeleteSubscriptionDto } from './dto/delete-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { UpsertSubServiceLimitDto } from './dto/upsert-sub-service-limit.dto'

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  listSubscription(limit: boolean) {
    return this.prisma.subscription.findMany({
      where: {
        deletedAt: null
      },
      include: {
        subscriptionServiceLimits: limit
      }
    })
  }

  createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        name: createSubscriptionDto.name,
        isMonthly: createSubscriptionDto.isMonthly === 'true',
        duration: +createSubscriptionDto.duration,
        price: +createSubscriptionDto.price
      }
    })
  }

  deleteSubscription(deleteSubscriptionDto: DeleteSubscriptionDto) {
    return this.prisma.subscription.update({
      where: {
        id: +deleteSubscriptionDto.id
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  updateSubscription(createSubscriptionDto: UpdateSubscriptionDto) {
    return this.prisma.subscription.update({
      where: {
        id: +createSubscriptionDto.id
      },
      data: {
        name: createSubscriptionDto.name,
        isMonthly: createSubscriptionDto.isMonthly === 'true',
        duration: +createSubscriptionDto.duration,
        price: +createSubscriptionDto.price
      }
    })
  }

  createServiceLimit(createSubServiceLimitDto: UpsertSubServiceLimitDto) {
    if (+createSubServiceLimitDto.usageLimits < 0) {
      return this.prisma.subscriptionServiceLimit.delete({
        where: {
          subscriptionId_serviceType: {
            subscriptionId: +createSubServiceLimitDto.subscriptionId,
            serviceType: createSubServiceLimitDto.serviceType
          }
        }
      })
    }

    return this.prisma.subscriptionServiceLimit.upsert({
      where: {
        subscriptionId_serviceType: {
          subscriptionId: +createSubServiceLimitDto.subscriptionId,
          serviceType: createSubServiceLimitDto.serviceType
        }
      },
      update: {
        usageLimits: +createSubServiceLimitDto.usageLimits
      },
      create: {
        subscriptionId: +createSubServiceLimitDto.subscriptionId,
        serviceType: createSubServiceLimitDto.serviceType,
        usageLimits: +createSubServiceLimitDto.usageLimits
      }
    })
  }

  async useService({
    userId,
    serviceType,
    description
  }: {
    userId: string
    serviceType: string
    description: string
  }) {
    let userSubscription = (await this.prisma.userSubscription.findFirst({
      where: { userId },
      include: { subscription: { include: { subscriptionServiceLimits: true } } }
    })) as any

    // 如果用户没有订阅，假设使用免费订阅
    if (!userSubscription) {
      const defaultSubscription = await this.prisma.subscription.findFirst({
        where: {
          isDefault: true,
          deletedAt: null
        },
        include: { subscriptionServiceLimits: true }
      })

      if (!defaultSubscription) {
        throw new BadRequestException('Default subscription not found')
      }

      userSubscription = {
        userId,
        subscription: defaultSubscription
      }
    }

    if (!userSubscription) {
      throw new BadRequestException('No subscription available')
    }

    const serviceLimit = userSubscription.subscription.subscriptionServiceLimits.find(
      limit => limit.serviceType === serviceType
    )

    const currentUsage = await this.prisma.serviceUsage.findFirst({
      where: { userId, serviceType }
    })

    if (serviceLimit) {
      if (currentUsage && currentUsage.usageCount >= serviceLimit.usageLimits) {
        throw new BadRequestException('Service usage limit reached')
      }
    }

    if (currentUsage) {
      await this.prisma.serviceUsage.update({
        where: { id: currentUsage.id },
        data: { usageCount: { increment: 1 }, description }
      })
    } else {
      await this.prisma.serviceUsage.create({
        data: { userId, serviceType, usageCount: 1, description }
      })
    }
  }
}