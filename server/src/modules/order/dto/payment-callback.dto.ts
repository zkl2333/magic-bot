import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator'

export class PaymentCallbackDto {
  @IsString()
  @IsNotEmpty()
  aoid: string

  @IsString()
  @IsNotEmpty()
  order_id: string

  @IsNotEmpty()
  @IsNumberString()
  pay_price: number

  @IsString()
  @IsNotEmpty()
  pay_time: string

  @IsString()
  @IsOptional()
  more: string

  @IsString()
  @IsNotEmpty()
  detail: string

  @IsString()
  @IsNotEmpty()
  sign: string
}
