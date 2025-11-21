import { Injectable } from '@angular/core';

export interface SellerRequest {
  id: number;
  name: string;
  email: string;
  date: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  justification?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerRequestService {
  private requests: SellerRequest[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      date: new Date(),
      status: 'PENDING',
      justification: 'Je vends des produits artisanaux'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      date: new Date(),
      status: 'PENDING'
    }
  ];

  getAll(): SellerRequest[] {
    return this.requests;
  }

  addRequest(request: Omit<SellerRequest, 'id' | 'date' | 'status'>): void {
    const newRequest: SellerRequest = {
      id: this.requests.length + 1,
      name: request.name,
      email: request.email,
      date: new Date(),
      status: 'PENDING',
      justification: request.justification
    };
    this.requests.push(newRequest);
  }

  updateStatus(id: number, status: 'ACCEPTED' | 'REJECTED'): void {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      request.status = status;
    }
  }

  deleteRequest(id: number): void {
    this.requests = this.requests.filter(r => r.id !== id);
  }
}