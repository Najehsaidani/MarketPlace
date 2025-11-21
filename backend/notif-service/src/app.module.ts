import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NotificationSchema } from './models/src/models/notification.schema';
import { AppController } from './app.controller';
import { NotificationRoutes } from './routes/notification.routes';
import { EurekaService } from './eureka.service';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({ isGlobal: true }), // loads .env globally
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  providers: [EurekaService],
  controllers: [AppController, NotificationRoutes],
})
export class AppModule {}
