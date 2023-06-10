import { IsNumberString } from 'class-validator'

export class DeleteServiceDto {
  @IsNumberString()
  id: string
}
