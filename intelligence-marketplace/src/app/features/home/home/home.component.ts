import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../Types/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularProducts: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products);
        this.popularProducts = products.slice(0, 6); // Get first 6 products
        this.loading = false;
      },
      // error: (error) => {
      //   console.error('Error loading products:', error);
      //   this.error = 'Failed to load products from backend';
      //   this.loading = false;
      //   // Fallback to static data if API fails
       
      // }
    });
  }

  scroll(direction: 'prev' | 'next') {
    const carouselEl = document.querySelector('.carousel-content');
    if (carouselEl) {
      const scrollAmount = 300;
      carouselEl.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
