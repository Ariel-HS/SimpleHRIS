import { Body, Controller, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service.js';

@Controller('photos')
export class PhotosController {
    constructor(
        private photosService: PhotosService
    ) {}
    
    @Post('create')
    create(@Body() photo: string) {
        return this.photosService.create(photo);
    }

    @Get(':attendance_id')
    findOne(@Param('attendance_id') attendance_id: number) {
        return this.photosService.findOneByAttendanceId(+attendance_id);
    }
}
