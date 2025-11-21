import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { OrdersComponent } from '../../components/orders/orders.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    OrdersComponent
  ]
})
export class DashboardComponent {
  constructor() { }
}
