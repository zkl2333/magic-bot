import { Module } from '@nestjs/common'
import { TestController } from './test.controller'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'

@Module({
  controllers: [TestController],
  providers: [AiProxyService]
})
export class TestModule {}
