import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity.js';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class AttendanceService {
    checkInTime: Date;

    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async getTodayAttendance() {
        return await this.attendanceRepository.find({
            where: {
                date: new Date()
            },
            relations: {
                user: true,
                photo: true
            }
        });
    }

    async getStaffAttendance(userId: number) {
        return await this.attendanceRepository.find({
            where: {
                user: { id: userId }
            },
            relations: {
                user: true,
                photo: true
            }
        });
    }

    async checkIn(userId: number, photo: any) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const isOnTime = this.checkInTime && new Date() <= this.checkInTime;

        const attendance = this.attendanceRepository.create({
            user: user,
            date: new Date(),
            time: new Date().toLocaleTimeString(),
            status: isOnTime ? 'on-time' : 'late',
            photo: photo
        });

        return await this.attendanceRepository.save(attendance);
    }
}
