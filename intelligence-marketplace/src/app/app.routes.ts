// AVANT (Incorrect)
// import { HomeComponent } from './features/home/home.component';

// APRÈS (Correct)
import { HomeComponent } from './features/home/home/home.component';
import { CategoryComponent } from './features/category/category/category.component';
import { DetailComponent } from './features/detail/detail/detail.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { ProfileComponent } from './features/profile/profile/profile.component';
// Removed chat component import
import { TopSellerComponent } from './features/top-seller/top-seller/top-seller.component';
import { BecomeSellerComponent } from './features/become-seller/become-seller/become-seller.component';
import { ContactComponent } from './features/contact/contact/contact.component';
import { SellerDemandComponent } from './features/seller-demand/seller-demand/seller-demand.component';
import { SellerNotificationsComponent } from './features/seller-notifications/seller-notifications/seller-notifications.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil - Intelligence Marketplace' },
  { path: 'catalogue', component: CategoryComponent, title: 'Catalogue Général' },
  { path: 'catalogue/:id', component: DetailComponent, title: 'Détail Produit' },
  { path: 'panier', component: CartComponent, title: 'Mon Panier' },
  { path: 'profile', component: ProfileComponent, title: 'Mon Profil' },
  // Removed chat route
  { path: 'top-sellers', component: TopSellerComponent, title: 'Meilleurs Vendeurs' },
  { path: 'become-seller', component: BecomeSellerComponent, title: 'Devenir Vendeur' },
  { path: 'contact', component: ContactComponent, title: 'Contactez-nous' },
  { path: 'seller-demand', component: SellerDemandComponent, title: 'Demandes Vendeurs' },
  { path: 'seller-notifications', component: SellerNotificationsComponent, title: 'Notifications Vendeur' },
  { path: '**', redirectTo: '' }
];
