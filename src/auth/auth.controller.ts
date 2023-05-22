import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AccountActivateDto } from './dto/account-activate.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AuthenticatedUser } from 'src/decorators/authenticated-user';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException("Couldn't not found your account");
    }

    //Check user if have valid credential
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password.');
    }

    if (!user.status) {
      throw new BadRequestException('Please activate your account');
    }

    //return token
    return {
      accessToken: await this.jwtService.signAsync({ email: user.email }),
    };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    //Check if email was taken
    const { email, password, firstName, lastName } = registerDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new BadRequestException('Email was already taken');
    }

    //Hash password
    const hashPassword = await this.authService.hashPassword(password);
    //Store user in the database
    const salt = 10;
    const token = this.authService.generateToken();
    const tokenHash = await bcrypt.hash(token, salt);
    await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        firstName,
        lastName,
        activationToken: tokenHash,
      },
    });

    //Send email token to the user
    this.authService.sendMailToken(email, token);

    return { message: 'Account created' };
  }

  @Post('/activate')
  async activate(@Body() accountActivateDto: AccountActivateDto) {
    const { token, email } = accountActivateDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user.status) {
      throw new BadRequestException('Account already activated');
    }

    //Check token match
    const tokenMatch = await bcrypt.compare(token, user.activationToken);

    if (!tokenMatch) {
      throw new BadRequestException('Invalid token');
    }

    //Update user status
    await this.prisma.user.update({
      where: { email: email },
      data: { activationToken: null, status: true },
    });

    return { message: 'Account successfully activated' };
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @AuthenticatedUser() user: User,
    @Body() changePassword: ChangePasswordDto,
  ) {
    //Check if current password is match
    const oldPasswordMatch = await bcrypt.compare(
      changePassword.password,
      user.password,
    );

    if (!oldPasswordMatch) {
      throw new BadRequestException('Old password is wrong');
    }

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: await this.authService.hashPassword(
          changePassword.newPassword,
        ),
      },
    });

    return { message: 'Password changed' };
  }
}
