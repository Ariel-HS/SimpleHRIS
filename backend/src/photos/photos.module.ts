import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller.js';
import { PhotosService } from './photos.service.js';
import { Photos } from './entities/photos.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Photos])],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
