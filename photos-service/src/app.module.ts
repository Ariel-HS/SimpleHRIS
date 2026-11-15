import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photos } from './entities/photos.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '1521'),
      username: process.env.DB_USERNAME ?? 'hris',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_SERVICE_NAME ?? 'FREEPDB1',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),

    TypeOrmModule.forFeature([Photos]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
