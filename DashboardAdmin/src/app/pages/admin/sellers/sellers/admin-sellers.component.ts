import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { SellerService } from '../../../../services/seller/seller.service';
import { ClientResponse, ClientModel } from '../../../../services/client/client.model';

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  totalProducts: number;
  totalSales: number;
  rating: number;
}

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './admin-sellers.component.html',
  styleUrls: ['./admin-sellers.component.scss']
})
export class AdminSellersComponent implements OnInit {
  sellers: Seller[] = [];
  filteredSellers: Seller[] = [];
  selectedSeller: Seller | null = null;
  showSellerModal = false;
  showAddSellerModal = false;
  searchTerm = '';
  selectedStatus = 'all';
  sortBy = 'name';

  // New seller form data
  newSeller: Seller = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationDate: new Date(),
    status: 'active',
    totalProducts: 0,
    totalSales: 0,
    rating: 0
  };

  constructor(private sellerService: SellerService) { }

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    // Call the backend service to get all sellers
    console.log('Fetching sellers from backend...');
    this.sellerService.getAllSellers().subscribe({
      next: (response: any) => {
        console.log('Raw response from backend:', response);
        let sellers: ClientResponse[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          sellers = response;
        } else if (response && Array.isArray(response.data)) {
          sellers = response.data;
        } else if (response && Array.isArray(response.sellers)) {
          sellers = response.sellers;
        } else {
          console.error('Unexpected response format:', response);
          alert('Error: Unexpected data format received from backend.');
          return;
        }

        console.log('Processing sellers:', sellers);
        this.sellers = sellers.map(seller => ({
          id: seller.id || 0,
          name: seller.nom || '',
          email: seller.email || '',
          phone: seller.telephone || '',
          address: seller.adresse || '',
          registrationDate: new Date(), // This would need to come from another field
          status: seller.statut ? seller.statut.toLowerCase() as 'active' | 'inactive' | 'suspended' : 'inactive',
          totalProducts: 0, // This would need to come from another service
          totalSales: 0,    // This would need to come from another service
          rating: 0         // This would need to come from another service
        }));
        console.log('Mapped sellers:', this.sellers);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
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
        alert('Error loading sellers from backend. Please check your connection and try again.');
      },
      complete: () => {
        console.log('Seller loading completed');
      }
    });
  }

  loadMockSellers(): void {
    // This method is no longer used since we're fetching real data from the backend
    console.log('Mock data method is deprecated');
  }

  applyFilters(): void {
    this.filteredSellers = this.sellers.filter(seller => {
      const matchesSearch = seller.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           seller.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' || seller.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    this.filteredSellers.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'registrationDate':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'totalSales':
          return b.totalSales - a.totalSales;
        case 'totalProducts':
          return b.totalProducts - a.totalProducts;
        default:
          return 0;
      }
    });
  }

  activateSeller(id: number): void {
    const seller = this.sellers.find(s => s.id === id);
    if (seller) {
      seller.status = 'active';
      this.applyFilters();
      // Call the backend service to update the seller
      const sellerModel: ClientModel = {
        nom: seller.name,
        email: seller.email,
        motDePasse: '', // Password would be required for modification
        statut: 'ACTIVE',
        adresse: seller.address,
        telephone: seller.phone,
        estVendeur: true
      };

      this.sellerService.modifySeller(id, sellerModel).subscribe({
        next: (response) => {
          console.log('Seller activated successfully:', response);
        },
        error: (error) => {
          console.error('Error activating seller:', error);
          // Revert the change if the backend call fails
          seller.status = 'inactive'; // or whatever the previous status was
          this.applyFilters();
        }
      });
    }
  }

  suspendSeller(id: number): void {
    const seller = this.sellers.find(s => s.id === id);
    if (seller) {
      seller.status = 'suspended';
      this.applyFilters();
      // Call the backend service to update the seller
      const sellerModel: ClientModel = {
        nom: seller.name,
        email: seller.email,
        motDePasse: '', // Password would be required for modification
        statut: 'INACTIVE',
        adresse: seller.address,
        telephone: seller.phone,
        estVendeur: true
      };

      this.sellerService.modifySeller(id, sellerModel).subscribe({
        next: (response) => {
          console.log('Seller suspended successfully:', response);
        },
        error: (error) => {
          console.error('Error suspending seller:', error);
          // Revert the change if the backend call fails
          seller.status = 'active'; // or whatever the previous status was
          this.applyFilters();
        }
      });
    }
  }

  deleteSeller(id: number): void {
    // Call the backend service to delete the seller
    this.sellerService.deleteSeller(id).subscribe({
      next: (response) => {
        console.log('Seller deleted successfully:', response);
        // Remove the seller from the local list
        this.sellers = this.sellers.filter(s => s.id !== id);
        this.applyFilters();

        // If we're viewing the details of the removed seller, close the modal
        if (this.selectedSeller && this.selectedSeller.id === id) {
          this.closeSellerModal();
        }
      },
      error: (error) => {
        console.error('Error deleting seller:', error);
        // Show error message to user
        alert('Error deleting seller. Please try again.');
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

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getSellerInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getSellerId(id: number): string {
    return `SELLER-${id.toString().padStart(3, '0')}`;
  }

  viewSellerDetails(seller: Seller): void {
    this.selectedSeller = seller;
    this.showSellerModal = true;
  }

  closeSellerModal(): void {
    this.showSellerModal = false;
    this.selectedSeller = null;
  }

  openAddSellerForm(): void {
    // Reset the new seller form
    this.newSeller = {
      id: Math.max(...this.sellers.map(s => s.id), 0) + 1,
      name: '',
      email: '',
      phone: '',
      address: '',
      registrationDate: new Date(),
      status: 'active',
      totalProducts: 0,
      totalSales: 0,
      rating: 0
    };
    this.showAddSellerModal = true;
  }

  closeAddSellerModal(): void {
    this.showAddSellerModal = false;
  }

  addSeller(): void {
    // Create a ClientModel from the newSeller data
    const sellerModel: ClientModel = {
      nom: this.newSeller.name,
      email: this.newSeller.email,
      motDePasse: '', // Password would be required for registration
      statut: 'ACTIVE',
      adresse: this.newSeller.address,
      telephone: this.newSeller.phone,
      estVendeur: true
    };

    // For creating a new seller, we would typically need to:
    // 1. Register the client first (if they don't exist)
    // 2. Then switch their role to seller
    // For now, we'll just add to the local list and show a message
    alert('In a real implementation, you would register the client and then switch their role to seller.');

    // Add the new seller to the list
    this.sellers.push({...this.newSeller});
    this.applyFilters();
    this.closeAddSellerModal();

    /*
    // This is how you would implement it in a real scenario:
    this.clientService.register(sellerModel).subscribe({
      next: (clientResponse) => {
        // After registering the client, switch their role to seller
        this.clientService.switchRole(clientResponse.id).subscribe({
          next: (sellerResponse) => {
            console.log('Seller created successfully:', sellerResponse);
            // Add the new seller to the list
            this.sellers.push({
              id: sellerResponse.id,
              name: sellerResponse.nom,
              email: sellerResponse.email,
              phone: sellerResponse.telephone || '',
              address: sellerResponse.adresse || '',
              registrationDate: new Date(),
              status: sellerResponse.statut.toLowerCase() as 'active' | 'inactive' | 'suspended',
              totalProducts: 0,
              totalSales: 0,
              rating: 0
            });
            this.applyFilters();
            this.closeAddSellerModal();
          },
          error: (error) => {
            console.error('Error switching client to seller:', error);
            alert('Error creating seller. Please try again.');
          }
        });
      },
      error: (error) => {
        console.error('Error registering client:', error);
        alert('Error creating seller. Please try again.');
      }
    });
    */
  }

  // Helper methods for stats
  getTotalActiveSellers(): number {
    return this.sellers.filter(seller => seller.status === 'active').length;
  }

  getTotalSuspendedSellers(): number {
    return this.sellers.filter(seller => seller.status === 'suspended').length;
  }

  getTotalInactiveSellers(): number {
    return this.sellers.filter(seller => seller.status === 'inactive').length;
  }
}
