import { Module } from '@nestjs/common'
import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, AiProxyService]
})
export class SubscriptionModule {}
