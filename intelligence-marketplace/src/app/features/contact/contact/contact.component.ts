import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitted = false;

  contactInfo = [
    {
      icon: '📍',
      title: 'Adresse',
      details: '123 Avenue des Champs-Élysées, 75008 Paris, France'
    },
    {
      icon: '📞',
      title: 'Téléphone',
      details: '+33 1 23 45 67 89'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: 'contact@intelligentmarketplace.com'
    },
    {
      icon: '🕒',
      title: 'Horaires',
      details: 'Lun-Ven: 9h-18h, Sam: 10h-16h'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitted = true;
      console.log('Form submitted:', this.contactForm.value);

      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission
      setTimeout(() => {
        alert('Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.');
        this.contactForm.reset();
        this.isSubmitted = false;
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.contactForm.controls;
  }
}
