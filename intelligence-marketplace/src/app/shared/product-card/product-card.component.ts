import { CommonModule} from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../Types/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product; // Modèle de produit
  
  // Add to cart functionality
  addToCart() {
    console.log('Add to cart clicked for product:', this.product.name);
    // In a real app, this would dispatch an action to add the product to cart
  }
  
  // Toggle wishlist functionality
  isInWishlist: boolean = false;
  
  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
    console.log('Toggle wishlist for product:', this.product.name);
    // In a real app, this would dispatch an action to add/remove from wishlist
  }
}