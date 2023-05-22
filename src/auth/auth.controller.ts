import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private prisma: PrismaService, private jwtService: JwtService) { }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.prisma.user.findUnique({ where: { email } })

    //Check user if have valid credential
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password.')
    }

    if (!user.status) {
      throw new BadRequestException('Please activate your account')
    }

    //return token
    return { accessToken: await this.jwtService.signAsync({ email: user.email }) }
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    //Check if email was taken
    const { email, password, firstName, lastName } = registerDto
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (user) {
      throw new BadRequestException('Email was already taken')
    }

    //Hash password
    const salt = 10
    const hashPassword = await bcrypt.hash(password, salt)
    await this.prisma.user.create({ data: { email, password: hashPassword, firstName, lastName } })

    //Store user in the database
    const token = this.authService.generateToken()
    //Send email token to the user
  }

  @Post('/activate')
  async activate() { }

  @Post('/change-password')
  async changePassword() { }
}
