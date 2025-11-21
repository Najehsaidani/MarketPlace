import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface VendorCart {
  vendorId: number;
  vendorName: string;
  products: CartItem[];
  productSearchTerm?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  vendorSearchTerm: string = '';

  // Structure de données simulant un panier multi-vendeurs
  carts: VendorCart[] = [
    {
      vendorId: 1,
      vendorName: 'Vendeur A',
      products: [
        { id: 1, name: 'iPhone 8 (Réparé)', price: 400, quantity: 1 },
        { id: 2, name: 'AirPods (Neufs)', price: 75, quantity: 2 },
      ]
    },
    {
      vendorId: 2,
      vendorName: 'Vendeur B - HighTech',
      products: [
        { id: 4, name: 'Laptop Pro', price: 1200, quantity: 1 },
        { id: 5, name: 'Webcam HD', price: 150, quantity: 1 },
      ]
    }
  ];

  getTotalItems(): number {
    return this.carts.reduce((total, vendor) => {
      return total + vendor.products.reduce((vendorTotal, item) => vendorTotal + item.quantity, 0);
    }, 0);
  }

  getTotalPrice(): number {
    return this.carts.reduce((total, vendor) => {
      return total + vendor.products.reduce((vendorTotal, item) => vendorTotal + (item.price * item.quantity), 0);
    }, 0);
  }

  getVendorTotal(vendorId: number): number {
    const vendor = this.carts.find(v => v.vendorId === vendorId);
    if (vendor) {
      return vendor.products.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    return 0;
  }

  increaseQuantity(vendorId: number, itemId: number): void {
    const vendor = this.carts.find(v => v.vendorId === vendorId);
    if (vendor) {
      const item = vendor.products.find(p => p.id === itemId);
      if (item) {
        item.quantity++;
      }
    }
  }

  decreaseQuantity(vendorId: number, itemId: number): void {
    const vendor = this.carts.find(v => v.vendorId === vendorId);
    if (vendor) {
      const item = vendor.products.find(p => p.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    }
  }

  updateQuantity(vendorId: number, itemId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      const vendor = this.carts.find(v => v.vendorId === vendorId);
      if (vendor) {
        const item = vendor.products.find(p => p.id === itemId);
        if (item) {
          item.quantity = newQuantity;
        }
      }
    }
  }

  removeItem(vendorId: number, itemId: number): void {
    const vendorIndex = this.carts.findIndex(v => v.vendorId === vendorId);
    if (vendorIndex !== -1) {
      const productIndex = this.carts[vendorIndex].products.findIndex(p => p.id === itemId);
      if (productIndex !== -1) {
        this.carts[vendorIndex].products.splice(productIndex, 1);

        // Remove vendor if no products left
        if (this.carts[vendorIndex].products.length === 0) {
          this.carts.splice(vendorIndex, 1);
        }
      }
    }
  }

  orderFromVendor(vendorId: number): void {
    const vendor = this.carts.find(v => v.vendorId === vendorId);
    if (vendor) {
      alert(`Commande passée chez ${vendor.vendorName} pour un total de ${this.getVendorTotal(vendorId).toFixed(2)} TND`);
    }
  }

  orderAll(): void {
    alert(`Commande passée pour un total de ${this.getTotalPrice().toFixed(2)} TND`);
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.carts = [];
    }
  }
}
