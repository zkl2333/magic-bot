import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AssistantsModule } from './assistants/assistants.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, AssistantsModule],

  providers: [PrismaService, JwtService],
})
export class AppModule {}
