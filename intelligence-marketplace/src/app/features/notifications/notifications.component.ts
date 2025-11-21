import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: { message: string, type: string, id: number }[] = [];
  private notificationSubscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // S'abonner aux notifications
    this.notificationSubscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      console.log('Notifications component received:', notifications);
    });
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  // Supprimer une notification spécifique
  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }

  // Supprimer toutes les notifications
  clearAll() {
    this.notificationService.clear();
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount(): number {
    return this.notifications.length;
  }
}
