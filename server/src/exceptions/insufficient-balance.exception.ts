import { HttpException, HttpStatus } from '@nestjs/common'

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.OK,
        code: 1002,
        message: '余额不足'
      },
      HttpStatus.OK
    )
  }
}
