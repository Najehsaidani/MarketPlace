import { Injectable } from '@angular/core';

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: ProductImage[];
  sellerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  categoryName?: string;
  stockQuantity?: number;
  inStock?: boolean;
  onSale?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Produit Exemple 1',
      description: 'Description du produit exemple 1 avec des détails complets',
      price: 29.99,
      image: 'assets/images/logo.png',
      images: [
        { url: 'assets/images/logo.png', publicId: 'logo1' },
        { url: 'assets/images/logo.png', publicId: 'logo2' }
      ],
      sellerId: 'seller-1',
      status: 'PENDING',
      categoryName: 'Électronique',
      stockQuantity: 15,
      inStock: true,
      onSale: false,
      averageRating: 4.5,
      reviewCount: 12
    },
    {
      id: 2,
      name: 'Produit Exemple 2',
      description: 'Description du produit exemple 2 avec des détails complets',
      price: 49.99,
      image: 'assets/images/logo.png',
      images: [
        { url: 'assets/images/logo.png', publicId: 'logo3' }
      ],
      sellerId: 'seller-1',
      status: 'APPROVED',
      categoryName: 'Vêtements',
      stockQuantity: 0,
      inStock: false,
      onSale: true,
      averageRating: 3.8,
      reviewCount: 8
    },
    {
      id: 3,
      name: 'Produit Exemple 3',
      description: 'Description du produit exemple 3 avec des détails complets',
      price: 19.99,
      image: 'assets/images/logo.png',
      sellerId: 'seller-2',
      status: 'REJECTED',
      categoryName: 'Accessoires',
      stockQuantity: 5,
      inStock: true,
      onSale: false,
      averageRating: 4.2,
      reviewCount: 5
    }
  ];

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      id: this.products.length + 1,
      ...product
    };
    this.products.push(newProduct);
  }

  updateProduct(id: number, product: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product };
    }
  }

  updateStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED'): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      product.status = status;
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
