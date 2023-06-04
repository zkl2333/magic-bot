import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AssistantsModule } from './modules/assistants/assistants.module';
import { ChatModule } from './modules/chat/chat.module';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    AssistantsModule,
    ChatModule,
    OrderModule,
    PrismaModule,
  ],
  providers: [JwtService],
})
export class AppModule {}
