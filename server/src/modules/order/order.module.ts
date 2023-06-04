import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, AiProxyService],
})
export class OrderModule {}
