import { IsNotEmpty } from 'class-validator';

export class OrderCreateDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  payType: string;
  @IsNotEmpty()
  points: number;
  @IsNotEmpty()
  orderUid: string;
  @IsNotEmpty()
  notifyUrl: string;
}
