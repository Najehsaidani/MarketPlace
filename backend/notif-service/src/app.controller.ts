import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('info')
  getInfo() {
    return {
      app: process.env.APP_NAME || 'nestjs-sample',
      status: 'UP',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'UP',
    };
  }
}
