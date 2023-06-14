import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './user.service'
import { AssistantsModule } from '../assistants/assistants.module'
import { UserAssistantsController } from './user-assistants/user-assistants.controller'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'
import { UserSubscriptionController } from './user-subscription/user-subscription.controller'
import { SubscriptionModule } from '../subscription/subscription.module'

@Module({
  imports: [AssistantsModule, SubscriptionModule],
  controllers: [UsersController, UserAssistantsController, UserSubscriptionController],
  providers: [UsersService, AiProxyService],
  exports: [UsersService]
})
export class UsersModule {}
