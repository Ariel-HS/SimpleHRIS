import * as bcrypt from 'bcrypt';

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserSeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const email = process.env.SEED_SUPERADMIN_EMAIL ?? 'admin@simplehris.local';
    const password = process.env.SEED_SUPERADMIN_PASSWORD ?? 'admin';
    const name = process.env.SEED_SUPERADMIN_NAME ?? 'admin';

    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      this.logger.log(`Superadmin already exists (${email}), skipping seed`);
      return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this.userRepository.save(
      this.userRepository.create({ name, email, password: hashedPassword, role: 'admin' }),
    );
    this.logger.log(`Seeded admin: ${email}`);
  }
}