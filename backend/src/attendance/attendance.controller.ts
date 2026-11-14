import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    // (admin) get all attendance for today
    @Get('today')
    today() {
        return this.attendanceService.getTodayAttendance();
    }

    // get staff attendance history
    @Get(':userId')
    staffAttendance(@Param('userId') userId: number) {
        return this.attendanceService.getStaffAttendance(userId);
    }

    // get staff attendance for a day
    @Get('day/:userId')
    dayAttendance(@Param('userId') userId: number, @Query('day') day?: string) {
        if (day) {
            return this.attendanceService.getStaffDayAttendance(userId, day);
        } else {
            return this.attendanceService.getStaffTodayAttendance(userId);
        }
    }

    // get staff attendance for a month
    @Get('month/:userId')
    monthAttendance(@Param('userId') userId: number, @Query('month') month: string) {
        return this.attendanceService.getStaffMonthAttendance(userId, month)
    }

    @Post('check-in/:userId')
    @UseInterceptors(FileInterceptor('selfie')) // 'selfie' = the form field name
    checkIn(
        @Param('userId', ParseIntPipe) userId: number,
        @UploadedFile(new ParseFilePipe({
            validators: [
            new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
            ],
        })) selfie: Express.Multer.File,
    ) {
        return this.attendanceService.checkIn(userId, selfie);
    }
}
