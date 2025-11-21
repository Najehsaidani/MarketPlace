import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminProductsComponent } from './pages/admin/products/products/admin-products.component';
import { AdminSellerRequestsComponent } from './pages/admin/seller-requests/seller-requests/admin-seller-requests.component';

import { ProductCategoriesComponent } from './pages/admin/categories/categories/product-categories.component';
import { AdminReviewsComponent } from './pages/admin/reviews/reviews/admin-reviews.component';
import { AdminContactsComponent } from './pages/admin/contacts/contacts/admin-contacts.component';
import { AdminClientsComponent } from './pages/admin/clients/clients/admin-clients.component';
import { AdminSellersComponent } from './pages/admin/sellers/sellers/admin-sellers.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
    { path: 'seller-requests', component: AdminSellerRequestsComponent },
    { path: 'all-products', component: AdminProductsComponent },
    { path: 'product-categories', component: ProductCategoriesComponent },
    { path: 'reviews', component: AdminReviewsComponent },
    { path: 'contacts', component: AdminContactsComponent },
    { path: 'clients', component: AdminClientsComponent },
    { path: 'sellers', component: AdminSellersComponent },
    { path: '', redirectTo: 'seller-requests', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
