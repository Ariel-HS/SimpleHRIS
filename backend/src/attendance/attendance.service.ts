import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity.js';
import { Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service.js'
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const TZ = process.env.TIME_ZONE ?? 'Asia/Jakarta';
const CheckInTime = process.env.CHECK_IN_TIME ?? '09:00:00'

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        private userService: UserService,
        @Inject('PHOTO_SERVICE') private photoClient: ClientProxy
    ) { }

    async getTodayAttendance() {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
        const attendanceList = await this.attendanceRepository.find({
            where: {
                date: today
            },
            relations: { user: true },
            select: {
                user: {
                    id: true,
                    name: true
                }
            }
        });

        return attendanceList;
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
        });

        return attendance ? this.fetchPhotoAndReturn(attendance) : null;
    }

    async getStaffDayAttendance(userId: number, date: string) {
        const attendance = await this.attendanceRepository.findOne({
            where: {
                user: { id: userId },
                date: date // get until day
            },
        });

        const response = attendance ? this.fetchPhotoAndReturn(attendance) : null;

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

        // Upload first, then record the attendance with the photo's id. 
        // The photo may live in another service, so there is no shared transaction
        // If the save fails we delete the photo again so it is not orphaned.
        const response = await firstValueFrom<{ id: number; mimeType: string }>(
            this.photoClient.send({ cmd: 'post_photo' }, {
                buffer: photo.buffer,
                mimetype: photo.mimetype,
            })
        );

        const photoId = response.id;

        if (!photoId) {
            await this.photoClient.send({ cmd: 'remove_photo' }, { id: photoId });
            throw new Error("Photo failed to upload");
        }

        try {
            const attendance = this.attendanceRepository.create({
                user: user,
                date: date,
                time: time,
                status: isOnTime ? 'on-time' : 'late',
                photoId,
            });

            return await this.attendanceRepository.save(attendance);
        } catch (error) {
            await this.photoClient.send({ cmd: 'remove_photo' }, { id: photoId });
            throw error;
        }
    }

    // Photo is fetched through PhotosClient and inlined as a data URL
    // If photo storage is down, the attendance record is still returned, with imgSrc set to null.
    private async fetchPhotoAndReturn(a: Attendance) {
        const { photoId, ...rest } = a;
        if (photoId == null) return { ...rest, photoId, photo: null };

        try {
            const stored = await firstValueFrom<{
                id: number;
                mimeType: string;
                imgSrc?: Buffer | { type: 'Buffer'; data: number[] };
            } | null> (
                this.photoClient.send({ cmd: 'get_photo' }, { id: photoId })
            )

            if (!stored || !stored.imgSrc) return { ...rest, photoId, photo: null };

            const fileBuffer = Buffer.isBuffer(stored.imgSrc)
                ? stored.imgSrc
                : Buffer.from(stored.imgSrc.data);

            return {
                ...rest,
                photoId,
                photo: {
                    id: photoId,
                    mimeType: stored.mimeType,
                    imgSrc: `data:${stored.mimeType};base64,${fileBuffer.toString('base64')}`,
                },
            };
        } catch (error) {
            return { ...rest, photoId, photo: { id: photoId, mimeType: null, imgSrc: null } };
        }
    }
}
