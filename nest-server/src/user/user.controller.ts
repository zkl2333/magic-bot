import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ParamsDto {
  @IsNumberString()
  @ApiProperty()
  id: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param() params: ParamsDto) {
    return this.userService.get(+params.id);
  }
}
