import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-seller',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './become-seller.component.html',
  styleUrl: './become-seller.component.css'
})
export class BecomeSellerComponent implements OnInit {
  sellerForm: FormGroup;
  isSubmitted = false;

  benefits = [
    {
      title: 'Large Audience',
      description: 'Access to thousands of potential customers',
      icon: '👥'
    },
    {
      title: 'Low Fees',
      description: 'Competitive commission rates',
      icon: '💰'
    },
    {
      title: 'Marketing Support',
      description: 'Promotional tools and visibility',
      icon: '📢'
    },
    {
      title: 'Easy Management',
      description: 'Simple dashboard to manage your store',
      icon: '📊'
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.sellerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      experience: ['beginner'],
      agreement: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.sellerForm.valid) {
      this.isSubmitted = true;
      console.log('Form submitted:', this.sellerForm.value);

      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission
      setTimeout(() => {
        alert('Votre demande a été soumise avec succès! Nous vous contacterons bientôt.');
        this.sellerForm.reset();
        this.isSubmitted = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.sellerForm.controls).forEach(key => {
      const control = this.sellerForm.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.sellerForm.controls;
  }
}
