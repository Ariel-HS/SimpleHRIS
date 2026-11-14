import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSeedService } from './user-seed.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])], 
  controllers: [UserController],
  providers: [UserService, UserSeedService],
  exports: [UserService],
})
export class UserModule {}

// TODO: Auth and User Management are combined in one module for simplicity
// Realistically, when there's more feature, these should be separated
