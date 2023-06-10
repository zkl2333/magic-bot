import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiProxyService]
})
export class ChatModule {}
