import { PickType } from '@nestjs/mapped-types';
import { LoginDto } from './login.dto';
import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/decorators/match';

export class ChangePasswordDto extends PickType(LoginDto, [
  'password',
] as const) {
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  @Match('newPassword')
  confirmNewPassword: string;
}
