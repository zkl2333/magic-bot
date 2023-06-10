import { IsNotEmpty, IsNumberString } from 'class-validator'

export class UpdateServiceDto {
  @IsNumberString()
  id: string
  @IsNotEmpty()
  name: string
  description: string
  @IsNotEmpty()
  type: string
}
