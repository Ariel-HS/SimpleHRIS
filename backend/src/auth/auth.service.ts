import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { User } from '../user/entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<User> {    
    try {
        const userEmail = registerDto.email;
        const userPassword = registerDto.password;

        await this.userService.register(userEmail, userPassword);
        
        const saved = await this.userService.findOneByEmail(registerDto.email);

        if (!saved) {
            throw new Error('User not exist. Please have admin create your account first.');
        } else {
            // TODO: Implement general way to remove password from response
            const { password, ...safe } = saved;
            return safe as User;
        }
    }
        catch (error) {
            throw error;
        }
    }

    async login(loginDto: any): Promise<{user: User, token: string}> {
        const user = await this.userService.findOneByEmail(loginDto.email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // TODO: Implement password hashing
        const isPasswordValid = user.password === loginDto.password;
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const { password, ...safe } = user;
        
        const payload = { userId: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            user: safe as User,
            token: accessToken
        }
    } 

    async getMe(userId: number): Promise<User> {
        const user = await this.userService.findOne(userId); 
        if (!user) {
            throw new Error('User not found');
        }

        const { password, ...safe } = user;
        
        return safe as User;
    }
}
