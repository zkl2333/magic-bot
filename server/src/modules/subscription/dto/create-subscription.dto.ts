import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator'

export class CreateSubscriptionDto {
  @IsNotEmpty()
  name: string
  @IsBooleanString()
  isMonthly: string
  @IsNumberString()
  duration: string
  @IsNumberString()
  price: string
}
