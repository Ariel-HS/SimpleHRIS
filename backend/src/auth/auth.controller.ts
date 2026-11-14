import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { User } from '../user/entities/user.entity.js';
import { JwtAuthGuard } from './guards/auth.guard.js'
import { Public } from './decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public() @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public() @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@CurrentUser() user: User) {
        const userId = user.id;
        return this.authService.getMe(userId);
    }
}
