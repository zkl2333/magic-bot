import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get(':id')
  findOne(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    console.log('currentUser', userId, currentUser);
    const id = userId === 'me' ? currentUser.id : userId;
    return this.userService.get(id);
  }
}
