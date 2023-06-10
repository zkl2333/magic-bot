import { IsNotEmpty } from 'class-validator'

export class CreateServiceDto {
  @IsNotEmpty()
  name: string
  description: string
  @IsNotEmpty()
  type: string
}
