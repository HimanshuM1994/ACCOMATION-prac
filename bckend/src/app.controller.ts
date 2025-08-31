import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Invoice Management API is running',
      timestamp: new Date().toISOString(),
    };
  }
}