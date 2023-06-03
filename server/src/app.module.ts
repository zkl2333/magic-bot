import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './common/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AssistantsModule } from './modules/assistants/assistants.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, AssistantsModule, ChatModule],
  providers: [PrismaService, JwtService],
})
export class AppModule {}
