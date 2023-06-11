import { IsNotEmpty, IsNumberString } from 'class-validator'

export class UpsertSubServiceLimitDto {
  @IsNumberString()
  subscriptionId: string
  @IsNotEmpty()
  serviceType: string
  @IsNumberString()
  usageLimits: string
}
