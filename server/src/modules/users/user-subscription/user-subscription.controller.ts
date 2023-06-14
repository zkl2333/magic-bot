import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { UserId } from '../decorators/user-id.decorator'
import { SubscriptionService } from 'src/modules/subscription/subscription.service'

@ApiTags('User Subscription')
@Controller('users/:id/subscription')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserSubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: '获取用户订阅列表' })
  @Get()
  async getSubscription(@UserId() userId: string) {
    return this.subscriptionService.getUserSubscription(userId)
  }
}
