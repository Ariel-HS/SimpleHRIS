import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Users are first created with default password ('simpleHris')
    // Users can then change their passwords with register
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('simpleHris', saltRounds);

    const entity = this.userRepository.create({
      password: hashedPassword,
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

  findAllStaff(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'staff' }
    })
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email: email });
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

  async register(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: email }); 
    if (!user) {
      throw new Error('User not found')
    }

    const userId = user.id;

    if (userId === 1) {
      throw new Error("Can't register superadmin");
    }

    try {
      await this.userRepository.update(userId, { email: email, password: password });
    }
    catch (error) {
      throw error;
    }
    
    const saved = await this.userRepository.findOneBy({ id: userId });

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
}
