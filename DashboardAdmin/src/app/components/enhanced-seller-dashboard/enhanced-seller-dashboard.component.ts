import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../../services/product.service';
import { DashboardService } from '../../services/dashboard.service';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}

interface Order {
  id: string;
  customerName: string;
  productName: string;
  orderDate: Date;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

@Component({
  selector: 'app-enhanced-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './enhanced-seller-dashboard.component.html',
  styleUrls: ['./enhanced-seller-dashboard.component.scss']
})
export class EnhancedSellerDashboardComponent implements OnInit {
  totalProducts: number = 0;
  approvedProducts: number = 0;
  pendingProducts: number = 0;
  totalSales: number = 0;
  recentProducts: Product[] = [];
  recentOrders: Order[] = [];

  constructor(
    private productService: ProductService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger les statistiques du vendeur
    this.dashboardService.getSellerStats().subscribe(stats => {
      this.totalProducts = stats.totalProducts;
      this.approvedProducts = stats.approvedProducts;
      this.pendingProducts = stats.pendingProducts;
      this.totalSales = stats.totalSales;
    });

    // Charger les produits récents
    this.productService.getSellerProducts().subscribe(products => {
      this.recentProducts = products.slice(0, 5); // Limiter à 5 produits récents
    });

    // Charger les commandes récentes
    this.dashboardService.getRecentOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5); // Limiter à 5 commandes récentes
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'APPROVED':
        return 'Approuvé';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return status;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  viewOrderDetails(orderId: string): void {
    // Naviguer vers les détails de la commande
    console.log('Afficher les détails de la commande:', orderId);
  }
}