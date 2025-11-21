import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../Types/product.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Category products loaded:', products);
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products from backend';
        this.loading = false;
        // Fallback to static data if API fails
        this.products = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          name: `Produit Catalogue ${i + 1}`,
          price: 50 + (i * 10),
          description: `Description for product ${i + 1}`
        }));
      }
    });
  }
}
