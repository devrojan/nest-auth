import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountActivateDto {
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
