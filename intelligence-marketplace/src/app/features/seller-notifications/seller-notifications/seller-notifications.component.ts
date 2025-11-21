import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-seller-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-notifications.component.html',
  styleUrl: './seller-notifications.component.css'
})
export class SellerNotificationsComponent implements OnInit {
  notifications: { message: string, type: string, id: number }[] = [];
  loading = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    // Subscribe to notifications
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.loading = false;
    });
  }

  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }

  clearAll() {
    this.notificationService.clear();
  }
}