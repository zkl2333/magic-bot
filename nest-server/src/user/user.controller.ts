import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param() params: { id: string }) {
    const user = this.userService.get(+params.id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
