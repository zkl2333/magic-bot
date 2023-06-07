// upgrade-membership.dto.ts
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpgradeMembershipDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  newTierId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;
}
