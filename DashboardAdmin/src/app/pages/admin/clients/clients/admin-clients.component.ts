import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { ClientService } from '../../../../services/client/client.service';
import { ClientModel, ClientResponse } from '../../../../services/client/client.model';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  totalOrders: number;
  totalSpent: number;
}

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss']
})
export class AdminClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  showClientModal = false;
  showAddClientModal = false;
  searchTerm = '';
  selectedStatus = 'all';
  sortBy = 'name';

  // New client form data
  newClient: Client = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationDate: new Date(),
    status: 'active',
    totalOrders: 0,
    totalSpent: 0
  };

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    // Call the backend service to get all clients
    console.log('Fetching clients from backend...');
    this.clientService.getAllClients().subscribe({
      next: (response: any) => {
        console.log('Raw response from backend:', response);
        let clients: ClientResponse[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          clients = response;
        } else if (response && Array.isArray(response.data)) {
          clients = response.data;
        } else if (response && Array.isArray(response.clients)) {
          clients = response.clients;
        } else {
          console.error('Unexpected response format:', response);
          alert('Error: Unexpected data format received from backend.');
          return;
        }

        console.log('Processing clients:', clients);
        this.clients = clients.map(client => ({
          id: client.id || 0,
          name: client.nom || '',
          email: client.email || '',
          phone: client.telephone || '',
          address: client.adresse || '',
          registrationDate: new Date(), // This would need to come from another field
          status: client.statut ? client.statut.toLowerCase() as 'active' | 'inactive' | 'suspended' : 'inactive',
          totalOrders: 0, // This would need to come from another service
          totalSpent: 0   // This would need to come from another service
        }));
        console.log('Mapped clients:', this.clients);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        // Log more detailed error information
        if (error.error) {
          console.error('Error details:', error.error);
        }
        if (error.status) {
          console.error('Error status:', error.status);
        }
        if (error.message) {
          console.error('Error message:', error.message);
        }
        // Even if there's an error, we should show the user that there was a problem
        // rather than falling back to mock data
        alert('Error loading clients from backend. Please check your connection and try again.');
      },
      complete: () => {
        console.log('Client loading completed');
      }
    });
  }

  loadMockClients(): void {
    // This method is no longer used since we're fetching real data from the backend
    console.log('Mock data method is deprecated');
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || client.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    this.filteredClients.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'registrationDate':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        default:
          return 0;
      }
    });
  }

  activateClient(id: number): void {
    const client = this.clients.find(c => c.id === id);
    if (client) {
      client.status = 'active';
      this.applyFilters();
      // Call the backend service to update the client
      // Note: We need to map our client back to the ClientModel
      const clientModel: ClientModel = {
        nom: client.name,
        email: client.email,
        motDePasse: '', // Password would be required for modification
        statut: 'ACTIVE',
        adresse: client.address,
        telephone: client.phone,
        estVendeur: false // This would depend on the actual client
      };

      this.clientService.modify(id, clientModel).subscribe({
        next: (response) => {
          console.log('Client activated successfully:', response);
        },
        error: (error) => {
          console.error('Error activating client:', error);
          // Revert the change if the backend call fails
          client.status = 'inactive'; // or whatever the previous status was
          this.applyFilters();
        }
      });
    }
  }

  suspendClient(id: number): void {
    const client = this.clients.find(c => c.id === id);
    if (client) {
      client.status = 'suspended';
      this.applyFilters();
      // Call the backend service to update the client
      const clientModel: ClientModel = {
        nom: client.name,
        email: client.email,
        motDePasse: '', // Password would be required for modification
        statut: 'INACTIVE',
        adresse: client.address,
        telephone: client.phone,
        estVendeur: false // This would depend on the actual client
      };

      this.clientService.modify(id, clientModel).subscribe({
        next: (response) => {
          console.log('Client suspended successfully:', response);
        },
        error: (error) => {
          console.error('Error suspending client:', error);
          // Revert the change if the backend call fails
          client.status = 'active'; // or whatever the previous status was
          this.applyFilters();
        }
      });
    }
  }

  deleteClient(id: number): void {
    // Call the backend service to delete the client
    this.clientService.switchRole(id).subscribe({
      next: (response) => {
        console.log('Client deleted successfully:', response);
        // Remove the client from the local list
        this.clients = this.clients.filter(c => c.id !== id);
        this.applyFilters();

        // If we're viewing the details of the removed client, close the modal
        if (this.selectedClient && this.selectedClient.id === id) {
          this.closeClientModal();
        }
      },
      error: (error) => {
        console.error('Error deleting client:', error);
        // Show error message to user
        alert('Error deleting client. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'suspended': return 'status-suspended';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'bx-check-circle';
      case 'inactive': return 'bx-user-plus';
      case 'suspended': return 'bx-block';
      default: return 'bx-help-circle';
    }
  }

  getClientInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getClientId(id: number): string {
    return `CUST-${id.toString().padStart(3, '0')}`;
  }

  viewClientDetails(client: Client): void {
    this.selectedClient = client;
    this.showClientModal = true;
  }

  closeClientModal(): void {
    this.showClientModal = false;
    this.selectedClient = null;
  }

  openAddClientForm(): void {
    // Reset the new client form
    this.newClient = {
      id: Math.max(...this.clients.map(c => c.id), 0) + 1,
      name: '',
      email: '',
      phone: '',
      address: '',
      registrationDate: new Date(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0
    };
    this.showAddClientModal = true;
  }

  closeAddClientModal(): void {
    this.showAddClientModal = false;
  }

  addClient(): void {
    // Create a ClientModel from the newClient data
    const clientModel: ClientModel = {
      nom: this.newClient.name,
      email: this.newClient.email,
      motDePasse: '', // Password would be required for registration
      statut: 'ACTIVE',
      adresse: this.newClient.address,
      telephone: this.newClient.phone,
      estVendeur: false
    };

    // Call the backend service to create the client
    this.clientService.register(clientModel).subscribe({
      next: (response) => {
        console.log('Client created successfully:', response);
        // Add the new client to the list
        this.clients.push({
          id: response.id,
          name: response.nom,
          email: response.email,
          phone: response.telephone || '',
          address: response.adresse || '',
          registrationDate: new Date(),
          status: response.statut.toLowerCase() as 'active' | 'inactive' | 'suspended',
          totalOrders: 0,
          totalSpent: 0
        });
        this.applyFilters();
        this.closeAddClientModal();
      },
      error: (error) => {
        console.error('Error creating client:', error);
        // Show error message to user
        alert('Error creating client. Please try again.');
      }
    });
  }

  // Helper methods for stats
  getTotalActiveClients(): number {
    return this.clients.filter(client => client.status === 'active').length;
  }

  getTotalSuspendedClients(): number {
    return this.clients.filter(client => client.status === 'suspended').length;
  }

  getTotalInactiveClients(): number {
    return this.clients.filter(client => client.status === 'inactive').length;
  }
}
