import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { User } from '../user/entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js'

// Compared against when the email is unknown so response time doesn't reveal valid accounts.
const SALT_ROUND = 12
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUND);

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

        const hashedPassword = await this.hashPassword(userPassword);

        await this.userService.register(userEmail, hashedPassword);
        
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

        const ok = await this.comparePassword(loginDto.password, user.password)
        if (!ok) {
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

    async hashPassword(password: string): Promise<string> {
        const saltRounds = SALT_ROUND;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash ?? DUMMY_HASH);
    }
}
