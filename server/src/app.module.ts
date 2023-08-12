import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { JwtService } from '@nestjs/jwt'
import { AssistantsModule } from './modules/assistants/assistants.module'
import { ChatModule } from './modules/chat/chat.module'
import { OrderModule } from './modules/order/order.module'
import { PrismaModule } from './prisma/prisma.module'
import { SubscriptionModule } from './modules/subscription/subscription.module'
import { TestModule } from './libraryTest/test.module'
import { SystemModule } from './modules/system/system.module'
import { join } from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    UsersModule,
    AuthModule,
    AssistantsModule,
    ChatModule,
    OrderModule,
    PrismaModule,
    SubscriptionModule,
    TestModule,
    SystemModule
  ],
  providers: [JwtService]
})
export class AppModule {}
