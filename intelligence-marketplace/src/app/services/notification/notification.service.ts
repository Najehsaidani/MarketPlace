import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Notification {
  message: string;
  type: string;
  id: number;
  read: boolean;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsList: Notification[] = [];
  notifications$ = new BehaviorSubject<Notification[]>([]);

  addNotification(message: string, type: string = 'info') {
    const notificationId = Date.now();
    this.notificationsList.push({
      message,
      type,
      id: notificationId,
      read: false,
      timestamp: new Date()
    });
    this.notifications$.next([...this.notificationsList]);
    console.log('Notification added:', { message, type, id: notificationId });

    // Auto-suppression après 10 secondes pour les notifications de type info
    if (type === 'info') {
      setTimeout(() => {
        this.removeNotification(notificationId);
      }, 10000);
    }
  }

  removeNotification(id: number) {
    this.notificationsList = this.notificationsList.filter(n => n.id !== id);
    this.notifications$.next([...this.notificationsList]);
  }

  clear() {
    this.notificationsList = [];
    this.notifications$.next([]);
  }

  markAsRead(id: number) {
    const notification = this.notificationsList.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifications$.next([...this.notificationsList]);
    }
  }

  markAllAsRead() {
    this.notificationsList.forEach(notification => {
      notification.read = true;
    });
    this.notifications$.next([...this.notificationsList]);
  }

  getUnreadCount(): number {
    return this.notificationsList.filter(n => !n.read).length;
  }

  // Méthodes pour les types spécifiques de notifications

  // Notification de produit validé ou refusé (pour le vendeur)
  productValidation(productName: string, isApproved: boolean) {
    const message = isApproved
      ? `Votre produit ${productName} a été validé par l'administrateur.`
      : `Votre produit ${productName} a été refusé.`;

    this.addNotification(message, isApproved ? 'success' : 'error');
  }

  // Notification de produit acheté (pour le vendeur)
  productSold(productName: string, customerName?: string) {
    const customer = customerName ? `par un client ${customerName}` : '';
    this.addNotification(`Votre produit ${productName} a été acheté ${customer}.`, 'info');
  }

  // Notification de demande de vendeur acceptée/refusée
  sellerRequest(isApproved: boolean) {
    const message = isApproved
      ? 'Félicitations ! Vous êtes maintenant vendeur.'
      : 'Votre demande de devenir vendeur a été refusée.';

    this.addNotification(message, isApproved ? 'success' : 'error');
  }

  // Notification de commande confirmée (client)
  orderConfirmed(orderId: number) {
    this.addNotification(`Votre commande #${orderId} a été confirmée.`, 'success');
  }

  // Notification de commande reçue (vendeur)
  orderReceived(productName: string) {
    this.addNotification(`Vous avez une nouvelle commande pour le produit ${productName}.`, 'info');
  }
}
