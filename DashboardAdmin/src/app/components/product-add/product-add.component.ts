import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <div class="content">
      <app-navbar></app-navbar>
      
      <main>
        <div class="app-container">
          <div class="card">
            <h2>Ajouter un produit</h2>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nom</label>
                  <input class="form-control" formControlName="name" />
                </div>
                <div class="form-group">
                  <label>Prix</label>
                  <input class="form-control" type="number" formControlName="price" />
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea class="form-control textarea" formControlName="description"></textarea>
              </div>
              <div class="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" class="form-control" (change)="onFileSelected($event)" #fileInput />
              </div>
              <div class="form-group" *ngIf="imagePreview">
                <label>Prévisualisation</label>
                <img [src]="imagePreview" alt="Prévisualisation" style="max-width: 200px; margin-top: 10px;" />
              </div>
              <div class="actions">
                <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Enregistrer produit</button>
                <div *ngIf="message" class="notification">{{ message }}</div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class SellerAddProductComponent {
  form: FormGroup;
  imagePreview: string | null = null;
  message = '';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required]],
      image: [''],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.form.patchValue({ image: this.imagePreview });
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.productService.addProduct({
      name: val.name || '',
      description: val.description || '',
      price: Number(val.price) || 0,
      image: val.image || '',
      sellerId: 'current-seller-id', // À remplacer par l'ID réel du vendeur connecté
      status: 'PENDING'
    });
    this.message = 'Produit ajouté avec succès';
    this.form.reset({ name: '', description: '', price: 0, image: '' });
    this.imagePreview = null;
    setTimeout(() => (this.message = ''), 3500);
  }
}