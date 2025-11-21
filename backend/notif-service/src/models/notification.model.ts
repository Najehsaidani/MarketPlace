export class Notification {
  notif_id: number;
  user_id: number;
  message: string;

  constructor(notif_id: number, user_id: number, message: string) {
    this.notif_id = notif_id;
    this.user_id = user_id;
    this.message = message;
  }
}
