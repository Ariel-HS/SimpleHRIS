import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { LoginDto } from '../auth/dto/login.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { User } from './entities/user.entity.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('staffs')
  findAllStaff() {
    return this.userService.findAllStaff();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    const currentUserId = user.id;

    if (currentUserId === id) {
      throw new BadRequestException('You cannot delete your own account.');
    }

    return this.userService.remove(id);
  }
}
