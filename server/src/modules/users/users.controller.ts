import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/common/decorators/currentUser.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: '获取用户信息' })
  @Get(':id')
  findOne(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    console.log('currentUser', userId, currentUser);
    const id = userId === 'me' ? currentUser.id : userId;
    return this.userService.get(id);
  }

  @ApiOperation({ summary: '修改密码' })
  @Post(':id/password')
  updatePassword(
    @Param('id') userId: string,
    @Body()
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
  ) {
    return this.userService.updatePassword(userId, oldPassword, newPassword);
  }
}
