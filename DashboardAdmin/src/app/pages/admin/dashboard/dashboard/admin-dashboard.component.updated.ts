import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="content">
      <app-navbar></app-navbar>
      <main>
        <div class="admin-dashboard">
            <div class="admin-sidebar">
                <h3>Tableau de bord</h3>
                <ul class="sidebar-menu">
                    <li class="menu-item">
                        <a routerLink="seller-requests" class="menu-link">
                            <i class='bx bx-user-plus'></i>
                            <span>Gérer les vendeurs</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a routerLink="all-products" class="menu-link">
                            <i class='bx bx-box'></i>
                            <span>Tous les produits</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a routerLink="product-categories" class="menu-link">
                            <i class='bx bx-category'></i>
                            <span>Gérer les catégories</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="admin-content">
                <router-outlet></router-outlet>
            </div>
        </div>
    </main>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {}
