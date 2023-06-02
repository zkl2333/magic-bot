import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  findOne(@Param('userId') userId: string, @User() user) {
    const id = userId === 'me' ? user.id : userId;
    return this.userService.get(id);
  }

  @Get(':id/assistants')
  findAssistants(@Param('userId') userId: string, @User() user) {
    const id = userId === 'me' ? user.id : userId;
    return this.userService.getAssistants(id);
  }
}
