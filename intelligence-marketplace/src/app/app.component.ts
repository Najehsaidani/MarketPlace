import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificationService } from './services/notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importez les composants autonomes
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'intelegent-marketplace';
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit() {
    // Add some sample notifications
    this.notificationService.addNotification('Bienvenue sur notre marketplace !', 'info');
    this.notificationService.productValidation('iPhone 12 Pro', true);
    this.notificationService.orderConfirmed(12345);
    console.log('App component initialized with sample notifications');
  }
}
