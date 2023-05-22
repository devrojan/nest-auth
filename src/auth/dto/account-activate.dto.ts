import { IsNotEmpty } from 'class-validator';

export class AccountActivateDto {
  @IsNotEmpty()
  token: string;
}
