import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy.js'

@Global()
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'my-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, 
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
