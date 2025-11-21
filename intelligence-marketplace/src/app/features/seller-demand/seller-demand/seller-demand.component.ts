import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../../services/seller/seller.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-seller-demand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-demand.component.html',
  styleUrl: './seller-demand.component.css'
})
export class SellerDemandComponent implements OnInit {
  sellerRequests: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private sellerService: SellerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadSellerRequests();
  }

  loadSellerRequests() {
    this.loading = true;
    // In a real application, this would fetch from an API
    // For now, we'll use mock data
    setTimeout(() => {
      this.sellerRequests = [
        {
          id: 1,
          clientName: 'Ahmed Ben Salah',
          email: 'ahmed.bensalah@email.com',
          requestDate: new Date('2025-11-10'),
          status: 'pending'
        },
        {
          id: 2,
          clientName: 'Fatma Zohra',
          email: 'fatma.zohra@email.com',
          requestDate: new Date('2025-11-12'),
          status: 'pending'
        },
        {
          id: 3,
          clientName: 'Mohamed Ali',
          email: 'mohamed.ali@email.com',
          requestDate: new Date('2025-11-15'),
          status: 'approved'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  approveRequest(requestId: number) {
    const request = this.sellerRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'approved';
      this.notificationService.sellerRequest(true);
      this.notificationService.addNotification(
        `Demande de ${request.clientName} approuvée avec succès.`,
        'success'
      );
    }
  }

  rejectRequest(requestId: number) {
    const request = this.sellerRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'rejected';
      this.notificationService.sellerRequest(false);
      this.notificationService.addNotification(
        `Demande de ${request.clientName} rejetée.`,
        'error'
      );
    }
  }
}