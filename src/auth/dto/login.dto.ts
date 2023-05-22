import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password must be longer than or equal to 6 characters',
  })
  @MaxLength(20, {
    message: 'Password must be shorter than or equal to 20 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain upper case and lower case letters and number or special character ',
  })
  password: string;
}
