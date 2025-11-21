import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Date;
  status: 'new' | 'in-progress' | 'resolved';
}

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-contacts.component.html',
  styleUrls: ['./admin-contacts.component.scss']
})
export class AdminContactsComponent implements OnInit {
  contacts: Contact[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      subject: 'Problème de commande',
      message: 'J\'ai un problème avec ma commande #12345. Le produit n\'est pas arrivé.',
      date: new Date('2023-10-15'),
      status: 'new'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      subject: 'Question sur un produit',
      message: 'Pouvez-vous m\'en dire plus sur le tapis artisanal en laine ?',
      date: new Date('2023-10-18'),
      status: 'in-progress'
    },
    {
      id: 3,
      name: 'Pierre Bernard',
      email: 'pierre.bernard@example.com',
      subject: 'Retour produit',
      message: 'Je souhaite retourner le bijou que j\'ai acheté la semaine dernière.',
      date: new Date('2023-10-20'),
      status: 'resolved'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  updateStatus(id: number, status: 'new' | 'in-progress' | 'resolved'): void {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) {
      contact.status = status;
    }
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'in-progress': return 'En cours';
      case 'resolved': return 'Résolu';
      default: return status;
    }
  }

  // Helper methods for stats
  getNewContactsCount(): number {
    return this.contacts.filter(c => c.status === 'new').length;
  }

  getInProgressContactsCount(): number {
    return this.contacts.filter(c => c.status === 'in-progress').length;
  }

  getResolvedContactsCount(): number {
    return this.contacts.filter(c => c.status === 'resolved').length;
  }
}
