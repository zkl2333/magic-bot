import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountBannedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.OK,
        code: 1001,
        message: '账号被禁用',
      },
      HttpStatus.OK,
    );
  }
}
