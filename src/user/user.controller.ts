import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
