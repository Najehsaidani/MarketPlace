import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

interface Notification {
  message: string;
  type: string;
  id: number;
  read: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor, NgClass, DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isProfileMenuOpen = false;
  isNotificationsOpen = false;
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      console.log('Header received notifications:', notifications);
    });
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    // Mark all notifications as read when opening the popup
    if (this.isNotificationsOpen) {
      this.notificationService.markAllAsRead();
    }
  }

  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearAll() {
    this.notificationService.clear();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.isProfileMenuOpen = false;
    }
    if (!target.closest('.notification-popup') && !target.closest('.icon-link.notification')) {
      this.isNotificationsOpen = false;
    }
  }
}
