import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="content">
      <app-navbar></app-navbar>
      
      <main>
        <div class="app-container">
          <div class="card">
            <h2>Mes Produits</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of products">
                  <td>
                    <img *ngIf="product.image" [src]="product.image"
                         alt="Product image" style="width: 50px; height: 50px; object-fit: cover;" />
                  </td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.price }} €</td>
                  <td>
                    <span class="badge" [class.badge-warning]="product.status === 'PENDING'"
                                       [class.badge-success]="product.status === 'APPROVED'"
                                       [class.badge-error]="product.status === 'REJECTED'">
                       {{ product.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `
})
export class SellerProductsComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    // Temporairement, on utilise 'current-seller-id'
    // À remplacer par l'ID réel du vendeur connecté
    const currentSellerId = 'current-seller-id';
    this.products = this.productService.getAll()
      .filter(p => p.sellerId === currentSellerId);
  }
}