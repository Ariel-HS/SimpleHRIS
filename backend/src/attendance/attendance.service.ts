import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity.js';
import { Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service.js'

const TZ = process.env.TIME_ZONE ?? 'Asia/Jakarta';   
const CheckInTime = process.env.CHECK_IN_TIME ?? '09:00:00'

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        
        private userService: UserService
    ) {}

    async getTodayAttendance() {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
        return await this.attendanceRepository.find({
            where: {
                date: today
            },
            relations: { user: true},
            select: {
                user: {
                    id: true,
                    name: true
                }
            }
        });
    }

    async getStaffAttendance(userId: number) {
        return await this.attendanceRepository.find({
            where: {
                user: { id: userId }
            }
        });
    }

    async getStaffTodayAttendance(userId: number) {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
        const attendance = await this.attendanceRepository.findOne({
            where: { user: { id: userId }, date: today },
            relations: { photo: true },
        });
        return attendance ? this.toDto(attendance) : null;
    }

    async getStaffDayAttendance(userId: number, date: string) {
        const attendance = await this.attendanceRepository.findOne({
            where: {
                user: { id: userId },
                date: date // get until day
            },
            relations: { photo: true },
        });

        const response = attendance ? this.toDto(attendance) : null;
        
        return response;
    }

    async getStaffMonthAttendance(userId: number, month: string) {
        return await this.attendanceRepository.find({
            where: {
                user: { id: userId },
                date: Like(`${month}-%`) 
            },
            order: { date: 'ASC' },
        });
    }

    async checkIn(userId: number, photo: Express.Multer.File) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const now = new Date();
        const date = now.toLocaleDateString('en-CA', { timeZone: TZ });   // YYYY-MM-DD
        const time = now.toLocaleTimeString('en-GB', { timeZone: TZ });   // HH:mm:ss (24h)

        const exists = await this.attendanceRepository.exists({ where: { user: { id: userId }, date } });
        if (exists) throw new ConflictException('Already checked in today');

        const isOnTime = time <= CheckInTime ? true : false;

        const attendance = this.attendanceRepository.create({
            user: user,
            date: date,
            time: time,
            status: isOnTime ? 'on-time' : 'late',
            photo: { imgSrc: photo.buffer, mimeType: photo.mimetype },
        });

        return await this.attendanceRepository.save(attendance);
    }

    private toDto(a: Attendance) {
    const { photo, ...rest } = a;
    return {
        ...rest,
        photo: photo && {
            id: photo.id,
            mimeType: photo.mimeType,
            imgSrc: `data:${photo.mimeType};base64,${Buffer.from(photo.imgSrc).toString('base64')}`,
        },
    };
}
}
