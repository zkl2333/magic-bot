import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { AssistantsModule } from './modules/assistants/assistants.module'
import { ChatModule } from './modules/chat/chat.module'
import { OrderModule } from './modules/order/order.module'
import { PrismaModule } from './prisma/prisma.module'
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TestModule } from './libraryTest/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    AuthModule,
    AssistantsModule,
    ChatModule,
    OrderModule,
    PrismaModule,
    SubscriptionModule,
    TestModule
  ],
  providers: [JwtService]
})
export class AppModule {}
