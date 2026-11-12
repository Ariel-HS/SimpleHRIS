import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    // (admin) get all attendance for today
    @Get('today')
    today() {
        return this.attendanceService.getTodayAttendance();
    }

    // get staff attendance history
    @Get('attendance/:userId')
    myAttendance(@Param('userId') userId: number) {
        return this.attendanceService.getStaffAttendance(userId);
    }

    @Post('check-in/:userId')
    checkIn(
        @Param('userId') userId: number,
        @Body() body: 
        { 
            selfie: { type: 'string', format: 'binary' } 
        }
    ) {
        return this.attendanceService.checkIn(userId, body.selfie);
    }
}
