import { Schema } from 'mongoose';

export const NotificationSchema = new Schema(
  {
    notif_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { versionKey: false },
);
