import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, NgClass, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  // Profile form
  profileForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Client profile information
  clientInfo = {
    name: 'Ahmed Ben Salah',
    email: 'ahmed.bensalah@example.com',
    phone: '+216 20 123 456',
    address: 'Tunis, Tunisia',
    memberSince: 'Jan 2023',
    avatar: 'assets/avatar.jpg'
  };

  // Order history
  orderHistory = [
    {
      id: 'ORD-001',
      date: '2025-10-15',
      total: 249.99,
      status: 'Delivered',
      items: [
        { name: 'iPhone 8', quantity: 1, price: 199.99 },
        { name: 'Protective Case', quantity: 1, price: 25.00 },
        { name: 'Screen Protector', quantity: 2, price: 12.50 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2025-09-22',
      total: 899.99,
      status: 'Delivered',
      items: [
        { name: 'Laptop Pro 2024', quantity: 1, price: 899.99 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2025-08-05',
      total: 125.50,
      status: 'Cancelled',
      items: [
        { name: 'Wireless Earbuds', quantity: 1, price: 75.00 },
        { name: 'Charging Cable', quantity: 2, price: 25.25 }
      ]
    }
  ];

  // Seller dashboard data
  sellerStats = {
    totalProducts: 12,
    totalCategories: 5,
    totalReviews: 24,
    totalRevenue: 3450.75
  };

  // Seller products
  sellerProducts = [
    {
      id: 1,
      name: 'Smartphone X',
      price: 499.99,
      stock: 15,
      category: 'Electronics',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Laptop Pro',
      price: 1299.99,
      stock: 8,
      category: 'Computers',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 149.99,
      stock: 32,
      category: 'Audio',
      status: 'Active'
    }
  ];

  // Reviews
  reviews = [
    {
      id: 1,
      productName: 'Smartphone X',
      reviewer: 'Marwa Karray',
      rating: 5,
      comment: 'Excellent product! Fast delivery and well packaged.',
      date: '2025-10-20'
    },
    {
      id: 2,
      productName: 'Laptop Pro',
      reviewer: 'Ali Mansour',
      rating: 4,
      comment: 'Great performance but battery life could be better.',
      date: '2025-09-15'
    }
  ];

  // Payments
  payments = [
    {
      id: 'PAY-001',
      date: '2025-10-25',
      amount: 1250.00,
      status: 'Completed',
      method: 'Bank Transfer'
    },
    {
      id: 'PAY-002',
      date: '2025-09-30',
      amount: 890.50,
      status: 'Completed',
      method: 'PayPal'
    },
    {
      id: 'PAY-003',
      date: '2025-08-15',
      amount: 2150.25,
      status: 'Pending',
      method: 'Credit Card'
    }
  ];

  // Toggle between client and seller view
  isSellerView = false;

  // Current active tab
  activeTab: string = 'profile';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    // Initialize the profile form
    this.profileForm = this.fb.group({
      name: [this.clientInfo.name, [Validators.required, Validators.minLength(2)]],
      email: [this.clientInfo.email, [Validators.required, Validators.email]],
      phone: [this.clientInfo.phone, [Validators.required]],
      address: [this.clientInfo.address, [Validators.required]]
    });
  }

  ngOnInit() {
    // Subscribe to query params to set the active tab
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      } else {
        this.activeTab = 'profile';
      }

      // Check if user wants to see seller view
      if (params['view'] === 'seller') {
        this.isSellerView = true;
      }
    });

    // Add a test notification
    this.notificationService.addNotification('Welcome to your profile page!', 'info');
  }

  toggleView() {
    this.isSellerView = !this.isSellerView;
    // Update URL to reflect view change
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: this.isSellerView ? 'seller' : 'client' },
      queryParamsHandling: 'merge'
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Update URL without reloading the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      // In a real application, you would send this to your backend
      console.log('Uploading image:', this.selectedFile);

      // Simulate upload success
      this.notificationService.addNotification('Profile image updated successfully!', 'success');

      // Reset file selection
      this.selectedFile = null;
      this.imagePreview = null;

      // Reset file input
      const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Update client info with form values
      this.clientInfo.name = this.profileForm.get('name')?.value;
      this.clientInfo.email = this.profileForm.get('email')?.value;
      this.clientInfo.phone = this.profileForm.get('phone')?.value;
      this.clientInfo.address = this.profileForm.get('address')?.value;

      // In a real application, you would send this to your backend
      console.log('Profile updated:', this.profileForm.value);

      // Show success notification
      this.notificationService.addNotification('Profile updated successfully!', 'success');
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
      this.notificationService.addNotification('Please correct the form errors.', 'error');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Test notification
  testNotification() {
    this.notificationService.addNotification('Test notification from profile page!', 'info');
  }
}
