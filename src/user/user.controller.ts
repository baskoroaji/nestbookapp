import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('my')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  updateMe(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.editMe(userId, dto);
  }
}
