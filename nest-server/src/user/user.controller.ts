import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { findOneParamsDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param() params: findOneParamsDto) {
    return this.userService.get(params.id);
  }

  @Get()
  findAll() {
    return this.userService.getAll();
  }
}
