import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'
import { SubscriptionService } from '../subscription/subscription.service'

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiProxyService, SubscriptionService]
})
export class ChatModule {}
