import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller.js';
import { ApiGatewayService } from './api-gateway.service.js';

@Module({
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService]
})
export class ApiGatewayModule {}
