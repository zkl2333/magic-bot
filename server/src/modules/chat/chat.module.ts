import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiProxyService, PrismaService],
})
export class ChatModule {}
