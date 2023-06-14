import { IsNumberString } from 'class-validator'

export class DeleteSubscriptionDto {
  @IsNumberString()
  id: string
}
