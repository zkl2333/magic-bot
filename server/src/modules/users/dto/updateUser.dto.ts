export class UpdateUserDto {
  username?: string;
  nickname?: string;
  email?: string;
  settings?: {
    theme: string;
  };
}
