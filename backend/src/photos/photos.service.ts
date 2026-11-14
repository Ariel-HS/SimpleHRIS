import { Injectable } from '@nestjs/common';
import { Photos } from './entities/photos.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photos)
        private photosRepository: Repository<Photos>
    ) {}

    async create(photo: string): Promise<Photos> {
        // photo should be base64 string
        const matches = photo.match(/^data:(.+);base64,(.+)$/);

        if (!matches) {
            throw new Error('Invalid photo format');
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        const entity = this.photosRepository.create({
            imgSrc: buffer,
            mimeType: mimeType
        });

        try {
            return await this.photosRepository.save(entity);
        } catch (error) {
            throw error;
        }
    }

    async findOneByAttendanceId(attendance_id: number): Promise<Photos | null> {
        return await this.photosRepository.findOne({
            relations: {
                attendance: true
            },
            where: {
                attendance: { 
                    id: attendance_id 
                }
            }
        });
    }
}
