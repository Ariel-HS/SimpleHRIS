import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photos } from './entities/photos.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Photos)
    private photosRepository: Repository<Photos>
  ) { }

  async findPhotoById(id: number): Promise<Photos | null> {
    const photo = await this.photosRepository.findOne({
      where: {
        id: id
      }
    });

    return photo
  }

  async create(buffer: Buffer, mimeType: string): Promise<Photos> {
    return this.photosRepository.save(
      this.photosRepository.create({ imgSrc: buffer, mimeType }),
    );
  }

  async remove(id: number): Promise<void> {
    await this.photosRepository.delete(id);
  }
}
