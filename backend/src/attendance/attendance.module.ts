import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller.js';
import { AttendanceService } from './attendance.service.js';
import { Attendance } from './entities/attendance.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    UserModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}
