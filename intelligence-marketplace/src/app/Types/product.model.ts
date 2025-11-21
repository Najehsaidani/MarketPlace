import { Category } from './category.model';

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  images?: ProductImage[];
  category?: Category;
  categoryId?: number;
  categoryName?: string;
  status?: string;
  sellerId?: number;
}