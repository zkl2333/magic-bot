import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule],

  providers: [PrismaService, JwtService],
})
export class AppModule {}
