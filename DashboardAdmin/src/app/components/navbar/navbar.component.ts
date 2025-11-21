import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class NavbarComponent {
  constructor(private dashboardService: DashboardService) {}

  toggleTheme(): void {
    this.dashboardService.toggleTheme();
  }

  toggleSidebar(): void {
    this.dashboardService.toggleSidebar();
  }
}