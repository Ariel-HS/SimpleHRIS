import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_photo' })
  getPhoto(@Payload() data: { id: number }) {
    return this.appService.findPhotoById(data.id);
  }

  @MessagePattern({ cmd: 'post_photo' })
  async create(@Payload() data: { 
    buffer: Buffer | { type: 'Buffer'; data: number[] }; 
    mimetype: string 
  },) {
    console.log("PASS D")
    const fileBuffer = Buffer.isBuffer(data.buffer) 
      ? data.buffer 
      : Buffer.from(data.buffer.data);

    const photo = await this.appService.create(fileBuffer, data.mimetype);
    
    return { id: photo.id, mimeType: photo.mimeType };
  }

  @MessagePattern({ cmd: 'remove_photo' })
  removePhoto(@Payload() data: { id: number }) {
    return this.appService.remove(data.id);
  }
}
