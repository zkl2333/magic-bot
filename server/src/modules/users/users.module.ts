import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './user.service';
import { AssistantsModule } from '../assistants/assistants.module';
import { UserAssistantsController } from './user-assistants/user-assistants.controller';
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service';

@Module({
  imports: [AssistantsModule],
  controllers: [UsersController, UserAssistantsController],
  providers: [UsersService, AiProxyService],
  exports: [UsersService],
})
export class UsersModule {}
