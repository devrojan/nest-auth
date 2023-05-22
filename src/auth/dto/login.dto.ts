import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Min(6)
  password: string;
}
