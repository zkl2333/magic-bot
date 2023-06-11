import { Injectable } from '@nestjs/common'
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
}
