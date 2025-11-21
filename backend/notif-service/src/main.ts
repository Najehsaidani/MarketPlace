import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(process.env.PORT || '3000', 10);
  await app.listen(PORT);
  console.log(`NestJS started on port ${PORT}`);
}
bootstrap();
