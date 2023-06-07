// purchase-membership.dto.ts
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class PurchaseMembershipDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  tierId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;
}
