import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const entity = this.userRepository.create({
      ...createUserDto,
    });

    try {
      const saved = await this.userRepository.save(entity);
      const { password, ...safe } = saved;

      return safe as User;
    }
    catch (error) {
      throw error;
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.findOneBy({ id }); 
    try {
      await this.userRepository.update(id, updateUserDto);
    }
    catch (error) {
      throw error;
    }
    
    const saved = await this.userRepository.findOneBy({ id });

    if (!saved) {
      return null;
    } else {
      // TODO: Implement general way to remove password from response
      const { password, ...safe } = saved;
      return safe as User;
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  
  async login(loginDto: any) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // TODO: Implement password hashing
    const isPasswordValid = user.password === loginDto.password;
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      // TODO: Implement Auth Guards
    }
  } 
}
