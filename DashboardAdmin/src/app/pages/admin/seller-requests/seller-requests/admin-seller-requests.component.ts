import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { SellerRequestService, SellerRequest } from '../../../../services/seller-request.service';

@Component({
  selector: 'app-admin-seller-requests',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-seller-requests.component.html',
  styleUrls: ['./admin-seller-requests.component.scss']
})
export class AdminSellerRequestsComponent implements OnInit {
  items: SellerRequest[] = [];
  note = '';

  constructor(private service: SellerRequestService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.items = this.service.getAll();
  }

  decide(req: SellerRequest, decision: 'ACCEPTED' | 'REJECTED') {
    this.service.updateStatus(req.id, decision);
    if (decision === 'ACCEPTED') {
      // Simulate role update
      try {
        const mapRaw = localStorage.getItem('user_roles_v1');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[req.email] = 'ROLE_VENDEUR';
        localStorage.setItem('user_roles_v1', JSON.stringify(map));
        this.note = `✅ Client ${req.email} has been promoted to seller role.`;
      } catch (e) {
        this.note = `✅ Request accepted — unable to save role locally.`;
      }
    } else {
      this.note = `❌ Request from ${req.email} has been rejected.`;
    }
    this.load();
    setTimeout(() => (this.note = ''), 5000);
  }

  deleteRequest(id: number) {
    this.service.deleteRequest(id);
    this.note = `🗑️ Request has been deleted.`;
    this.load();
    setTimeout(() => (this.note = ''), 5000);
  }

  viewDetails(req: SellerRequest) {
    // In a real application, this would open a modal with more details
    alert(`Request Details:
Name: ${req.name}
Email: ${req.email}
Date: ${req.date}
Status: ${req.status}

Additional information would be displayed here in a real application.`);
  }

  // Helper methods for stats
  getPendingRequestsCount(): number {
    return this.items.filter(r => r.status === 'PENDING').length;
  }

  getAcceptedRequestsCount(): number {
    return this.items.filter(r => r.status === 'ACCEPTED').length;
  }

  getRejectedRequestsCount(): number {
    return this.items.filter(r => r.status === 'REJECTED').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'ACCEPTED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Accepté';
      case 'REJECTED': return 'Rejeté';
      default: return status;
    }
  }
}
