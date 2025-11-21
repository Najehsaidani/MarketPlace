import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../models/notification.model';

@Controller('notifications')
export class NotificationRoutes {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}

  // POST /notifications/create
  @Post('create')
  async createNotification(@Body() body: { user_id: number; message: string }) {
    // find the max notif_id to increment
    const lastNotif = await this.notificationModel
      .findOne()
      .sort({ notif_id: -1 })
      .exec();
    const newNotifId = lastNotif ? lastNotif.notif_id + 1 : 1;

    const newNotif = new this.notificationModel({
      notif_id: newNotifId,
      user_id: body.user_id,
      message: body.message,
    });

    return newNotif.save();
  }

  // GET /notifications/user/:id/get
  @Get('user/:id')
  async getUserNotifications(@Param('id') id: number) {
    return this.notificationModel.find({ user_id: id }).exec();
  }
}
