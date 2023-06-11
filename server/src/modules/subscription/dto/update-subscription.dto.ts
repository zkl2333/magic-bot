import { IsBooleanString, IsNotEmpty, IsNumberString } from 'class-validator'

export class UpdateSubscriptionDto {
  @IsNumberString()
  id: string
  @IsNotEmpty()
  name: string
  @IsBooleanString()
  isMonthly: string
  @IsNumberString()
  duration: string
  @IsNumberString()
  price: string
}
